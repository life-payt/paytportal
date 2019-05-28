from yaasc.rabbitmq_ci import YAASClient, YAASCHandler
import logging
import asyncio
import uuid
import sys
import base64
import os
import hashlib
import inspect
from dateutil.parser import parse
from payt_db.dbfuncs import DBfuncs
from file_parsers import p
from data_workers import w

if not os.path.exists('/tmp/payt/'):
	try:
		os.makedirs('/tmp/payt/')
	except OSError as exc:
		if exc.errno != errno.EEXIST:
			raise

MODULE='tenant'

LIVE_SUBS = ['waste'] #TODO

formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
def setup_logger(tenant_name):
	global logger
	logger = logging.getLogger(tenant_name)
	logger.setLevel(logging.DEBUG)

	fh = logging.FileHandler('/tmp/payt.log')
	fh.setLevel(logging.DEBUG)
	fh.setFormatter(formatter)

	ch = logging.StreamHandler()
	ch.setLevel(logging.DEBUG)
	ch.setFormatter(formatter)

	logger.addHandler(fh)
	logger.addHandler(ch)

class Tenant:
	def __init__(self, loop, **kwargs):
		self.name = kwargs.get('tenant_name', str(uuid.uuid4())[:8])
		setup_logger(self.name)
		self._db_args = kwargs['database']

		self._client = YAASClient(loop,
			key="%s-%s-%s"%('payt',self.name, MODULE),
			host=kwargs['broker'].get('host', '127.0.0.1'),
			port=kwargs['broker'].get('port', '127.0.0.1'),
			username=kwargs['broker'].get('user', 'anonymous'),
			password=kwargs['broker'].get('key', 'anonymous'),
			vhost=kwargs['broker'].get('vhost', '/'),
			exchange=self.name,
			exchange_type='topic'
		)
		self._client.on_connect = self.on_connect
		self._client.on_message = self._on_msg

		self.perms = {}
		try:
			self._users_parser = p[kwargs['parsers']['users']](self.name, self.process_user, self.update_producer_table)
			self._bills_parser = p[kwargs['parsers']['bills']](self.name, self.process_bill, self.update_user_status)
		except:
			self._client._loop.stop()
			sys.exit("File parsers not valid")

		self._sub_topics = {
			"process_users": "payt.%s.internal.process_users"%self.name,
			"process_bills": "payt.%s.internal.process_bills"%self.name
		}

		self._res_user_cache = {}

	async def start(self):
		attempts = 0
		await asyncio.sleep(120)
		while True:
			attempts += 1
			try:
				await self._client.connect()
				return self.dbh
				break
			except Exception as e:
				print('Not able to connect..')
				print(e)
				if attempts < 5:
					print("Could not connect to PAYT API. Waiting 60 seconds... ")
					await asyncio.sleep(300)
					return None
				else:
					self._client._loop.stop()
					sys.exit("Could not connect to PAYT API. Exiting... ")
					return None

	def filter_URI(self, uri):
		parts = uri.split('.')
		if parts[1] != self.name \
		or parts[2] != MODULE \
		or parts[4] != 'live' \
		or parts[5] not in LIVE_SUBS:
			return None
		return (parts[5], parts[6], uri, parts[7:])

	async def on_connect(self):
		yh = YAASCHandler(self._client)
		yh.setLevel(logging.DEBUG)
		yh.setFormatter(formatter)
		logger.addHandler(yh)
		logger.info('YAASC client connected')

		attempts = 0
		while True:
			attempts += 1
			try:
				self.dbh = DBfuncs(
					self.name,
					self._db_args['host'],
					self._db_args['port'],
					self._db_args['dbname'],
					self._db_args['username'],
					self._db_args['password'],
					self._client
				)
				await self.dbh.init(self.db_notification)
				logger.info('connected to database')
				break
			except Exception as e:
				if attempts < 5:
					logger.error("Could not connect to database (host: %s, port: %s). Waiting 30 seconds... "\
						%(self._db_args['host'],self._db_args['port']))
					await asyncio.sleep(30)
				else:
					logger.critical('cannot connect to database (host: %s, port: %s)'%(self._db_args['host'],self._db_args['port']))
					await asyncio.sleep(1.0)
					asyncio.get_event_loop().stop()
					sys.exit('cannot connect to database (host: %s, port: %s)'%(self._db_args['host'],self._db_args['port']))
					return None

		for sub in LIVE_SUBS:
			await self.dbh.listen(sub)

		# external calls
		await self._client.register('payt.%s.db.private.get_party_info'%self.name, self.get_party_info)
		await self._client.register('payt.%s.db.private.get_producer_waste_total'%self.name, self.get_producer_waste_total)
		await self._client.register('payt.%s.db.private.get_producer_real_bill'%self.name, self.get_producer_real_bill)
		await self._client.register('payt.%s.db.private.get_producer_simulated_bill'%self.name, self.get_producer_simulated_bill)
		await self._client.register('payt.%s.db.private.get_producer_real_bills'%self.name, self.get_producer_real_bills)
		await self._client.register('payt.%s.db.private.get_producer_simulated_bills'%self.name, self.get_producer_simulated_bills)
		await self._client.register('payt.%s.db.private.get_producer_day_average'%self.name, self.get_producer_day_average)
		await self._client.register('payt.%s.db.private.get_producer_zone_day_average'%self.name, self.get_producer_zone_day_average)
		await self._client.register('payt.%s.db.private.get_producers_waste'%self.name, self.get_monthly_waste)
		await self._client.register('payt.%s.db.private.get_month_highest_waste'%self.name, self.get_month_highest_waste)
		await self._client.register('payt.%s.db.private.get_week_highest_waste'%self.name, self.get_week_highest_waste)
		await self._client.register('payt.%s.db.private.get_day_highest_waste'%self.name, self.get_day_highest_waste)
		await self._client.register('payt.%s.db.private.get_weeks_highest_waste'%self.name, self.get_weekly_waste)
		await self._client.register('payt.%s.db.private.get_days_highest_waste'%self.name, self.get_days_highest_waste)
		await self._client.register('payt.%s.db.private.get_card_history'%self.name, self.get_card_logs)
		await self._client.register('payt.%s.db.private.set_mailing'%self.name, self.set_mailing_pref)
		await self._client.register('payt.%s.db.private.insert_card'%self.name, self.insert_idCard)
		await self._client.register('payt.%s.db.private.delete_idcard'%self.name, self.delete_idCard)
		await self._client.register('payt.%s.db.private.edit_producer_cards'%self.name, self.edit_producer_cards)
		await self._client.register('payt.%s.db.private.get_producer_cards'%self.name, self.get_producer_cards)
		await self._client.register('payt.%s.db.private.get_producers'%self.name, self.get_producers_front_end)
		await self._client.register('payt.%s.db.private.get_container_usage_month'%self.name, self.get_container_usage_by_month)
		await self._client.register('payt.%s.db.private.get_containers_usage'%self.name, self.get_containers_usage)
		await self._client.register('payt.%s.db.private.get_total_simulated_bill'%self.name, self.get_total_simulated_bill)
		await self._client.register('payt.%s.db.private.get_total_real_bill'%self.name, self.get_total_real_bill)
		await self._client.register('payt.%s.db.private.get_all_id_cards'%self.name, self.get_all_id_cards)
		await self._client.register('payt.%s.db.private.get_free_id_cards'%self.name, self.get_free_id_cards)
		await self._client.register('payt.%s.db.private.get_count_validated'%self.name, self.get_count_valid)
		await self._client.register('payt.%s.db.private.get_alias'%self.name, self.get_producer_add_alias)
		await self._client.register('payt.%s.db.private.edit_alias'%self.name, self.edit_address_alias)
		await self._client.register('payt.%s.db.internal.get_policies'%self.name, self.get_policies)
		await self._client.register('payt.%s.db.internal.get_functions'%self.name, self.get_functions)
		await self._client.register('payt.%s.db.internal.alter_policy'%self.name, self.alter_policy)
		await self._client.register('payt.%s.db.internal.alter_op'%self.name, self.alter_op)
		await self._client.register('payt.%s.db.private.get_containers'%self.name, self.get_containers)
		# internal calls
		await self._client.register('payt.%s.db.private.get_week_day_highest_waste'%self.name, self.get_week_day_highest_waste)
		await self._client.register('payt.%s.db.private.get_daily_waste'%self.name, self.dbh.get_producer_daily_waste_total)
		await self._client.register('payt.%s.db.private.insert_client_real_bill'%self.name, self.dbh.insert_client_real_bill)
		await self._client.register('payt.%s.db.private.insert_client_simulated_bill'%self.name, self.dbh.insert_client_simulated_bill)
		await self._client.register('payt.%s.upload.private.users_update'%self.name, self.users_parsing)
		await self._client.register('payt.%s.upload.private.bills_update'%self.name, self.bills_parsing)
		await self._client.register('payt.%s.db.private.ckan_total_rbill'%self.name, self.ckan_total_rbill)
		await self._client.register('payt.%s.db.private.ckan_total_sbill'%self.name, self.ckan_total_sbill)
		await self._client.register('payt.%s.db.private.ckan_total_person'%self.name, self.ckan_total_person)
		await self._client.register('payt.%s.db.private.ckan_total_business'%self.name, self.ckan_total_business)
		await self._client.register('payt.%s.db.private.ckan_containers_info'%self.name, self.ckan_containers_info)
		await self._client.register('payt.%s.db.private.insert_garbage'%self.name, self.insert_garbage)
		await self._client.register('payt.%s.db.private.insert_container'%self.name, self.insert_container)

		for topic in self._sub_topics.values():
			await self._client.subscribe(topic)

		logger.info('payt methods successfully registered')

		print('test')
		await self.dbh.init_funcs()
		self.perms = await self.dbh.init_perms()
		print('test2')
		print(self.perms)

	def access_control(function):
		async def wrapper(self, *args, **kwargs):
			user_id = kwargs.get('user_id')
			logger.debug('![ACCESS CONTROL]! - Entered Access Control Decision Making by method %s by user %s.'%(function.__name__, user_id))

			if function.__name__ in self.perms:
				p_all = self.perms[function.__name__]
				p = p_all.split('-')[0]
				op = p_all.split('-')[1]
			else:
				logger.debug('![ACCESS CONTROL]! - Access granted due to in development method.')
				return await function(self, *args, **kwargs)
			if user_id == 'auth':
				logger.debug('![ACCESS CONTROL]! - Access from auth module granted. No need for access control.')
				return await function(self, *args, **kwargs)
			
			role = await self.get_role(user_id)

			if p == 'public':
				target = inspect.getargspec(function)[1]
				if target == 'producer_id' and op == 'w':
					return await self.denied()

				logger.debug('![ACCESS CONTROL]! - Access granted.')
				return await function(self, *args, **kwargs)
			
			if p == 'restricted':
				# admin can do all
				if role == 'admin':
					return await function(self, *args, **kwargs)
				# get target info from args
				target = inspect.getargspec(function)[1]
				# reading & writing own
				if (op == 'r' or op == 'w') and (role == 'user' or role == 'county') and target != 'producer_id':
					logger.debug('![ACCESS CONTROL]! - Access granted.')
					return await function(self, *args, **kwargs)
				# writing and reading other
				if op == 'r' and role == 'county' and target == 'producer_id':
					logger.debug('![ACCESS CONTROL]! - Access granted.')
					return await function(self, *args, **kwargs)

				owns = await self.dbh.user_owns_producer(user_id, args[1])
				if (op == 'r' or op == 'w') and role == 'user' and target == 'producer_id' and owns:
					logger.debug('![ACCESS CONTROL]! - Access granted.')
					return await function(self, *args, **kwargs)

				# if no conditions are met -> deny
				return await self.denied()

			if p == 'internal':
				if role == 'admin' or isinstance(user_id, str):
					logger.debug('![ACCESS CONTROL]! - Access granted.')
					return await function(self, *args, **kwargs)

				return await self.denied()

			if p == 'owner':
				target = inspect.getargspec(function)[1]
				if not target:
					logger.debug('![ACCESS CONTROL]! - Access granted.')
					return await function(self, *args, **kwargs)
				
				return await self.denied()

			else:
				return await self.denied()
		
		return wrapper

	async def denied(self):
		logger.debug('![ACCESS CONTROL]! - Access denied.')
		return None

	async def db_notification(self, msg):
		logger.debug('db notification -> %s'%str(msg))
		pass

	async def _on_msg(self, msg, topic, exchange):
		if topic == self._sub_topics['process_users']:

			user_id = self._res_user_cache.pop(msg['resource'], None)
			if user_id:
				await self.notify(user_id, {
					"method": "add_users",
					"state": "processing",
					"nr_changes" : 0
				})

			fpath = '/tmp/payt/%s-%s'%(str(uuid.uuid4())[:8],msg['name'])
			with open(fpath, 'wb') as f:
				f.write(base64.b64decode(msg['content']))

			n, error = await self._users_parser.process(fpath)
			if user_id:
				await self.notify(user_id, {
					"method": "add_users",
					"state": "processed" if not error else error,
					"nr_changes" : n
				})

			os.remove(fpath)

		elif topic == self._sub_topics['process_bills']:

			user_id = self._res_user_cache.pop(msg['resource'], None)
			if user_id:
				await self.notify(user_id, {
					"method": "add_bills",
					"state": "processing",
					"nr_changes" : 0
				})

			fpath = '/tmp/payt/%s-%s'%(str(uuid.uuid4())[:8],msg['name'])
			with open(fpath, 'wb') as f:
				f.write(base64.b64decode(msg['content']))

			n, error = await self._bills_parser.process(fpath)
			if user_id:
				await self.notify(user_id, {
					"method": "add_bills",
					"state": "processed" if not error else error,
					"nr_changes" : n
				})

			os.remove(fpath)

	async def users_parsing(self, **kwargs):
		user_id = kwargs.get('user_id', None)
		if not user_id: return None

		resource, token = await self._client.call(
			'payt.http-server.create_resource',
			(self._sub_topics['process_users'], self.name),
			exchange='http-server'
		)

		await self.notify(user_id, {
			"method": "add_users",
			"state": "uploading",
			"nr_changes" : 0
		})
		self._res_user_cache[resource] = user_id

		return {
			'resource': resource,
			'token': token
		}

	async def bills_parsing(self, **kwargs):
		user_id = kwargs.get('user_id', None)
		if isinstance(user_id, int):
			role = await self.get_role(user_id)
		else:
			role = 'Service'
		logger.debug("[BILLS_PARSING][%s][%s]: Function called."%(user_id, role))

		if not user_id: return None

		resource, token = await self._client.call(
			'payt.http-server.create_resource',
			(self._sub_topics['process_bills'], self.name),
			exchange='http-server'
		)

		await self.notify(user_id, {
			"method": "add_bills",
			"state": "uploading",
			"nr_changes" : 0
		})
		self._res_user_cache[resource] = user_id

		return {
			'resource': resource,
			'token': token
		}

	# TYPE: 1 - Domestic; 2 - Business
	async def process_user(self, client_id, tax_id, name, police, street1, street2, city, parish, postal_code, client_type):
		logger.debug("[PROCESS_USER][INTERN]: Function called.")
		logger.debug("[PROCESS_USER][INTERN]: Sanitizing input..")

		#if tax_id == None:
		#	logger.debug('[PROCESS_USER][INTERN]: ERROR. No Tax ID provided. Unable to insert user..')
		#	return False
		if name == None:
			logger.debug("[PROCESS_USER][INTERN]: ERROR. No Client Name provided by source..")
			return False
		if police == None:
			logger.debug("[PROCESS_USER][INTERN]: No police provided. Inserting without..")
			police = ''
		if street1 == None:
			logger.debug("[PROCESS_USER][INTERN]: ERROR. No Street name provided.. User not inserted.")
			return False
		if street2 == None:
			logger.debug("[PROCESS_USER][INTERN]: No aditional address info provided. Inserting without..")
			street2 = ''
		if city == None:
			logger.debug("[PROCESS_USER][INTERN]: No city provided. Inserting without..")
			city = ''
		if parish == None:
			logger.debug("[PROCESS_USER][INTERN]: No parish provided. Inserting without..")
			parish = ''
		if postal_code == None:
			logger.debug("[PROCESS_USER][INTERN]: ERROR. No Postal Code provided.. User not inserted.")
			return False
		if client_type == None:
			logger.debug("[PROCESS_USER][INTERN]: ERROR. No Client Type provided.. User not inserted.")
			return False

		if not await self.dbh.producer_exists(str(client_id), str(tax_id)):
			zone_id = await self.dbh.zone_id(city.title())
			if not zone_id:
				zone_id = await self.dbh.insert_zone(city.title())

			producer_id = await self.dbh.insert_producer(zone_id)
			user_id = await self._client.call(
				'payt.auth.insert_user',
				str(client_id), None, 3, self.name,
				exchange='auth'
			)
			logger.debug("[PROCESS_USER][INTERN]: User_id %s added to auth." %(user_id))
			if not isinstance(client_type, int):
				client_type = int(client_type[0])
			if client_type == 1:
				logger.debug("[PROCESS_USER][INTERN]: Client type is 1 (domestic).")
				person_id = await self.dbh.person_id(tax_id)
				if not person_id:
					logger.debug('[PROCESS_USER][INTERN]: New Person. Inserting into database..')
					person_id = await self.dbh.insert_person(name.title(), tax_id, self.name.title())

				if not await self.dbh.user_exists(user_id):
					logger.debug('[PROCESS_USER][INTERN]: Associating User to Person.')
					await self.dbh.insert_user_person(user_id, person_id, client_type)

				logger.debug('[PROCESS_USER][INTERN]: Inserting Address.')
				address_id = await self.dbh.insert_address(str(street1).title()+' '+str(police), str(street2).title(), str(parish).title(), city.title(), postal_code)
				logger.debug('[PROCESS_USER][INTERN]: Associating Person to Producer.')
				pp_id = await self.dbh.insert_producer_person(client_id, address_id, person_id, producer_id)

			elif client_type == 2:
				logger.debug("[PROCESS_USER][INTERN]: Client type is 2 (business).")
				address_id = await self.dbh.insert_address(str(street1).title()+' '+str(police), str(street2).title(), str(parish).title(), city.title(), postal_code)
				org_id = await self.dbh.org_id(tax_id)
				if not org_id:
					org_id = await self.dbh.insert_org(name.title(), tax_id, address_id)

				business_id = await self.dbh.insert_business(name.title(), self.name.title(), None, org_id)
				pp_id = await self.dbh.insert_producer_business(client_id, address_id, business_id, producer_id)
				if not await self.dbh.user_exists(user_id):
					await self.dbh.insert_user_business(user_id, business_id, client_type)

			logger.info('[PROCESS_USER][INTERN]: Added new producer with ID %d', producer_id)
			return True
		else:
			logger.info('[PROCESS_USER][INTERN]: Client already exists')
			return False

	async def process_bill(self, client_id, tax_id, date, value, end_date):
		period_begin = None
		period_end = None
		logger.debug("[PROCESS_BILL][INTERN]: Function called.")
		party_id = await self.dbh.party_id(client_id, tax_id)

		if party_id:
			period_end = self.build_date_format(end_date)
			count_bills = await self.dbh.get_count_bills(party_id)
			if count_bills > 0:
				period_begin = await self.dbh.get_new_bill_date(party_id)

			await self.dbh.insert_real_bill(date, value, party_id, period_begin, period_end)
			logger.info('[PROCESS_BILL][INTERN]: Inserted real bill for party with ID %d', party_id)
			return True
		else:
			logger.info('[PROCESS_BILL][INTERN]: Client ID %s with Tax ID %s does not exist', str(client_id), str(tax_id))
			return False

	async def update_user_status(self):
		logger.debug("[UPDATE_USER_STATUS][INTERN]: Function called.")
		p_ids = await self.dbh.get_unactive_producers_ids()
		logger.debug("[UPDATE_USER_STATUS][INTERN]: Unactive producers obtained.")
		u_ids = []
		for x in p_ids:
			await self.dbh.remove_all_cards(x)
			await self.dbh.set_ended(x)
			u_id = await self.dbh.get_user_from_producer(x)
			u_ids.append(u_id)

		logger.debug("[UPDATE_USER_STATUS][INTERN]: Updating user statuses...")
		if u_ids:
			for x in u_ids:
				await self._client.call('payt.auth.internal.ex_client',x,exchange='auth')

		logger.debug("[UPDATE_USER_STATUS][INTERN]: User statuses updated.")

	async def update_producer_table(self):
		logger.debug("[UPDATE_PRODUCER_TABLE][INTERN]: Function called.")
		await self.dbh.build_producers_front_end()
		logger.debug("[UPDATE_PRODUCER_TABLE][INTERN]: Table updated.")

	@access_control
	async def get_monthly_waste(self, nMonths, **kwargs):
		user_id = kwargs.get('user_id')
		role = await self.get_role(user_id)
		logger.debug("[GET_PRODUCER_WASTE][%s][%s]: Function Called."%(user_id, role))

		ret = await self.dbh.get_monthly_waste(nMonths)
		logger.debug("[GET_PRODUCER_WASTE][%s][%s]: Waste Calculated From Database."%(user_id, role))
		return ret

	async def notify(self, user_id, content):
		return await self._client.publish('payt.notifications.%s'%str(user_id), content, 'notify')

	async def get_role(self, userid):
		role = await self.dbh.get_user_role(userid)
		return role

	@access_control
	async def insert_idCard(self, card, **kwargs):
		user_id = kwargs.get('user_id')
		role = await self.get_role(user_id)
		if role == 'county':
			logger.debug('[INSERT_IDCARD][%s][%s]: Access authorized.'%(user_id, role))
			ret = await self.dbh.insert_card(card)
			logger.debug('[INSERT_IDCARD][%s][%s]: Card %d has been inserted.'%(user_id, role, card))
			return ret
		else:
			logger.debug('[INSERT_IDCARD][%s][%s]: WARNING! UNAUTHORIZED ACCESS TO FUNCTION HAS BEEN ATTEMPTED!'%(user_id,role))
			return 0


	async def insert_producer_card(self, producer, card, **kwargs):
		user_id = kwargs.get('user_id')
		role = await self.get_role(user_id)
		if role == 'county':
			logger.debug('[INSERT_PRODUCER_CARD][%s][%s]: Access authorized.'%(user_id, role))
			ret = await self.dbh.insert_producer_card(producer,card)
			logger.debug('[INSERT_PRODUCER_CARD][%s][%s]: Card %d has been inserted for producer %s.'%(user_id, role, card,producer))
			return ret
		else:
			logger.debug('[INSERT_PRODUCER_CARD][%s][%s]: WARNING! UNAUTHORIZED ACCESS TO FUNCTION HAS BEEN ATTEMPTED!'%(user_id,role))
			return 0

	@access_control
	async def delete_idCard(self, card, **kwargs):
		user_id = kwargs.get('user_id')
		role = await self.get_role(user_id)
		if role == 'county':
			logger.debug('[DELETE_ID_CARD][%s][%s]: Access authorized.'%(user_id, role))

			await self.dbh.delete_card(card)
			logger.debug('[DELETE_ID_CARD][%s][%s]: Card %d has been deleted.'%(user_id, role, card))
			return 1
		else:
			logger.debug('[DELETE_ID_CARD][%s][%s]: WARNING! UNAUTHORIZED ACCESS TO FUNCTION HAS BEEN ATTEMPTED!'%(user_id,role))
			return 0


	async def remove_producer_card(self, producer, card, **kwargs):
		user_id = kwargs.get('user_id')
		role = await self.get_role(user_id)
		if role == 'county':
			logger.debug('[REMOVE_PRODUCER_CARD][%s][%s]: Access authorized.'%(user_id, role))
			ret = await self.dbh.delete_producer_card(producer,card)
			logger.debug('[REMOVE_PRODUCER_CARD][%s][%s]: Card %d has been removed for producer %s.'%(user_id, role, card,producer))
			return ret
		else:
			logger.debug('[REMOVE_PRODUCER_CARD][%s][%s]: WARNING! UNAUTHORIZED ACCESS TO FUNCTION HAS BEEN ATTEMPTED!'%(user_id,role))
			return 0

	@access_control
	async def edit_producer_cards(self, producer, new_cards, **kwargs):
		user_id = kwargs.get('user_id')
		role = await self.get_role(user_id)
		if role == 'county':
			logger.debug('[EDIT_PRODUCER_CARDS][%s][%s]: Access authorized.'%(user_id, role))
			cards = await self.dbh.get_producer_cards(producer)
			# add
			dif = self.diff(new_cards, cards)
			for c in dif:
				await self.dbh.insert_producer_card(producer, c)
			# remove
			dif = self.diff(cards, new_cards)
			for c in dif:
				await self.dbh.delete_producer_card(producer, c)
			
			logger.debug('[EDIT_PRODUCER_CARDS][%s][%s]: Cards of %d have been edited.'%(user_id, role, producer))
			return 1
		else:
			logger.debug('[EDIT_PRODUCER_CARDS][%s][%s]: WARNING! UNAUTHORIZED ACCESS TO FUNCTION HAS BEEN ATTEMPTED!'%(user_id,role))
			return 0

	@access_control
	async def get_producer_cards(self, producer, **kwargs):
		user_id = kwargs.get('user_id')
		role = await self.get_role(user_id)
		ret = []
		logger.debug('[GET_PRODUCER_CARDS][%s][%s]: Access authorized.'%(user_id, role))
		ret = await self.dbh.get_producer_cards(producer)
		logger.debug('[GET_PRODUCER_CARDS][%s][%s]: Cards of %s have obtained.'%(user_id, role, producer))
		return ret

	@access_control
	async def get_producers_front_end(self, page, nelements, search, **kwargs):
		user_id = kwargs.get('user_id')
		role = await self.get_role(user_id)
		logger.debug("[GET_PRODUCERS_FRONT_END][%s][%s] - Function called."%(user_id, role))
		# TODO: access control (proper one)
		if search == '':
			ret = await self.dbh.get_producers_front_end(page, nelements)
			logger.debug("[GET_PRODUCERS_FRONT_END][%s][%s] - Producer list obtained."%(user_id, role))
		else:
			ret = await self.dbh.get_producers_front_end_results(page, nelements, search)
			logger.debug("[GET_PRODUCERS_FRONT_END][%s][%s] - Search results obtained."%(user_id, role))

		return ret

	@access_control
	async def get_containers_usage(self, **kwargs):
		user_id = kwargs.get('user_id')
		role = await self.get_role(user_id)
		logger.debug("[GET_CONTAINERS_USAGE][%s][%s] - Function called."%(user_id, role))
		# TODO: access control
		ret = await self.dbh.get_containers_usage()
		logger.debug("[GET_CONTAINERS_USAGE][%s][%s] - Return obtained."%(user_id, role))
		return ret

	@access_control
	async def get_container_usage_by_month(self, container, nMonths, **kwargs):
		user_id = kwargs.get('user_id')
		role = await self.get_role(user_id)
		logger.debug("[GET_CONTAINER_USAGE_BY_MONTH][%s][%s] - Function called."%(user_id, role))
		# TODO: access control
		ret = await self.dbh.get_container_usage_by_month(container, nMonths)
		logger.debug("[GET_CONTAINER_USAGE_BY_MONTH][%s][%s] - Return obtained."%(user_id, role))
		return ret

	@access_control
	async def get_total_real_bill(self, **kwargs):
		user_id = kwargs.get('user_id')
		role = await self.get_role(user_id)
		logger.debug("[GET_TOTAL_REAL_BILL][%s][%s] - Function called."%(user_id, role))
		# TODO: access control
		ret = await self.dbh.get_total_real_bill()
		logger.debug("[GET_TOTAL_REAL_BILL][%s][%s] - Return obtained."%(user_id, role))
		if ret:
			return float(ret)
		else:
			return ret

	@access_control
	async def get_total_simulated_bill(self, **kwargs):
		user_id = kwargs.get('user_id')
		role = await self.get_role(user_id)
		logger.debug("[GET_TOTAL_SIMULATED_BILL][%s][%s] - Function called."%(user_id, role))
		# TODO: access control
		ret = await self.dbh.get_total_simulated_bill()
		logger.debug("[GET_TOTAL_SIMULATED_BILL][%s][%s] - Return obtained."%(user_id, role))
		if ret:
			return float(ret)
		else:
			return ret

	@access_control
	async def get_all_id_cards(self, page, nelements, **kwargs):
		user_id = kwargs.get('user_id')
		role = await self.get_role(user_id)
		logger.debug("[GET_ALL_ID_CARDS][%s][%s] - Function called."%(user_id, role))
		# TODO: access control
		ret = await self.dbh.get_id_cards(page, nelements)
		logger.debug("[GET_ALL_ID_CARDS][%s][%s] - Return obtained."%(user_id, role))
		return ret

	@access_control
	async def get_free_id_cards(self, page, nelements, **kwargs):
		user_id = kwargs.get('user_id')
		role = await self.get_role(user_id)
		logger.debug("[GET_FREE_ID_CARDS][%s][%s] - Function called."%(user_id, role))
		# TODO: access control
		ret = await self.dbh.get_free_id_cards(page, nelements)
		logger.debug("[GET_FREE_ID_CARDS][%s][%s] - Return obtained."%(user_id, role))
		return ret

	@access_control
	async def get_count_valid(self, **kwargs):
		user_id = kwargs.get('user_id')
		role = await self.get_role(user_id)
		logger.debug("[GET_COUNT_VALID][%s][%s] - Function called."%(user_id, role))
		ret = await self.dbh.get_count_validated()
		logger.debug("[GET_COUNT_VALID][%s][%s] - Return obtained."%(user_id, role))
		return ret

	@access_control
	async def edit_address_alias(self, producer_id, new_alias, **kwargs):
		user_id = kwargs.get('user_id')
		role = await self.get_role(user_id)
		logger.debug("[EDIT_ADDRESS_ALIAS][%s][%s] - Function called."%(user_id, role))
		ret = await self.dbh.edit_address_alias(producer_id, new_alias)
		if ret:
			logger.debug("[EDIT_ADDRESS_ALIAS][%s][%s] - Producer %s address alias edited."%(producer_id, user_id, role))
			return 1
		else:
			logger.debug("[EDIT_ADDRESS_ALIAS][%s][%s] - Alias not edited."%(user_id, role))
			return 0

	@access_control
	async def get_producer_add_alias(self, producer_id, **kwargs):
		user_id = kwargs.get('user_id')
		role = await self.get_role(user_id)
		logger.debug("[GET_PRODUCER_ADD_ALIAS][%s][%s] - Function called."%(user_id, role))
		ret = await self.dbh.get_add_alias(producer_id)
		logger.debug("[GET_PRODUCER_ADD_ALIAS][%s][%s] - Return obtained for producer %s."%(user_id, role, producer_id))
		return ret

	@access_control
	async def get_card_logs(self, card_id, **kwargs):
		logger.debug('[GET_CARD_LOGS][-][-]: Function called.')
		ret = await self.dbh.get_card_logs(card_id)
		logger.debug('[GET_CARD_LOGS][-][-]: Return Object obtained. Sent to front end.')
		return ret

	@access_control
	async def set_mailing_pref(self, option, **kwargs):
		user_id = kwargs.get('user_id')
		role = await self.get_role(user_id)
		logger.debug('[SET_MAILING_PREF][%s][%s]: Function called.'%(user_id, role))

		await self.dbh.set_mailing_option(user_id, option)
		logger.debug('[SET_MAILING_PREF][%s][%s]: Mailing preference set in database.'%(user_id, role))


	def diff(self, first, second):
		second = set(second)
		return [item for item in first if item not in second]


	async def ckan_total_rbill(self, **kwargs):
		logger.debug("[CKAN_TOTAL_RBILL][INTERNAL] - Function called.")
		ret = await self.dbh.ckan_total_rbill()
		logger.debug("[CKAN_TOTAL_RBILL][INTERNAL] - Return obtained.")
		return ret


	async def ckan_total_sbill(self, **kwargs):
		logger.debug("[CKAN_TOTAL_SBILL][INTERNAL] - Function called.")
		ret = await self.dbh.ckan_total_sbill()
		logger.debug("[CKAN_TOTAL_SBILL][INTERNAL] - Return obtained.")
		return ret


	async def ckan_total_person(self, **kwargs):
		logger.debug("[CKAN_TOTAL_PERSON][INTERNAL] - Function called.")
		ret = await self.dbh.ckan_total_person()
		logger.debug("[CKAN_TOTAL_PERSON][INTERNAL] - Return obtained.")
		return ret


	async def ckan_total_business(self, **kwargs):
		logger.debug("[CKAN_TOTAL_BUSINESS][INTERNAL] - Function called.")
		ret = await self.dbh.ckan_total_business()
		logger.debug("[CKAN_TOTAL_BUSINESS][INTERNAL] - Return obtained.")
		return ret


	async def ckan_containers_info(self, **kwargs):
		logger.debug("[CKAN_CONTAINERS_INFO][INTERNAL] - Function called.")
		ret = await self.dbh.ckan_containers_info()
		logger.debug("[CKAN_CONTAINERS_INFO][INTERNAL] - Return obtained.")
		return ret

	@access_control
	async def get_month_highest_waste(self, **kwargs):
		logger.debug('[GET_MONTH_HIGHEST_WASTE][][] - Function called.')
		ret = await self.dbh.get_month_highest_waste()
		logger.debug('[GET_MONTH_HIGHEST_WASTE][][] - Return obtained.')
		return ret

	@access_control
	async def get_week_highest_waste(self, **kwargs):
		logger.debug('[GET_WEEK_HIGHEST_WASTE] - Function called.')
		ret = await self.dbh.get_week_highest_waste_last()
		logger.debug('[GET_WEEK_HIGHEST_WASTE] - Return obtained.')
		return ret

	@access_control
	async def get_weekly_waste(self, nMonths, **kwargs):
		logger.debug('[GET_WEEKLY_WASTE] - Function called.')
		ret = await self.dbh.get_weeks_highest_waste_n(nMonths)
		logger.debug('[GET_WEEKLY_WASTE] - Return obtained.')
		return ret

	@access_control
	async def get_day_highest_waste(self, **kwargs):
		logger.debug('[GET_DAY_HIGHEST_WASTE] - Function called.')
		ret = await self.dbh.get_day_highest_waste()
		logger.debug('[GET_DAY_HIGHEST_WASTE] - Return obtained.')
		return ret

	@access_control
	async def get_days_highest_waste(self, nMonths, **kwargs):
		logger.debug('[GET_DAY_HIGHEST_WASTE] - Function called.')
		ret = await self.dbh.get_days_highest_waste(nMonths)
		logger.debug('[GET_DAY_HIGHEST_WASTE] - Return obtained.')
		return ret

	@access_control
	async def get_policies(self, page, nelements, **kwargs):
		user_id = kwargs.get('user_id')
		logger.debug("[GET_POLICIES][%s][INTERNAL] - Function Called."%(user_id))
		
		ret = await self.dbh.get_policy_table(limit=nelements, offset=(page-1)*nelements)
	
		if ret:
			logger.debug("[GET_POLICIES][%s][INTERNAL] - All policies Sent To Front End."%(user_id))
		else:
			logger.debug("[GET_POLICIES][%s][INTERNAL] - No policies Sent To Front End."%(user_id))

		return ret

	@access_control
	async def get_functions(self, page, nelements, **kwargs):
		user_id = kwargs.get('user_id')
		logger.debug("[GET_FUNCTIONS][%s][INTERNAL] - Function Called."%(user_id))
		ret = None
		ret = await self.dbh.get_functions_table(limit=nelements, offset=(page-1)*nelements)

		if ret:
			logger.debug("[GET_FUNCTIONS][%s][INTERNAL] - All policies Sent To Front End."%(user_id))
			return ret
		else:
			logger.debug("[GET_FUNCTIONS][%s][INTERNAL] - No policies Sent To Front End."%(user_id))
			return []

		return ret

	@access_control
	async def alter_policy(self, id, policy, **kwargs):
		logger.debug('Function called')

		await self.dbh.alter_field_policy(id, policy)
		self.perms = await self.dbh.init_perms()
		return 1

	@access_control
	async def alter_op(self, id, op, **kwargs):
		logger.debug('function called')
		await self.dbh.alter_operation(id, op)
		self.perms = await self.dbh.init_perms()
		return 1

	@access_control
	async def get_party_info(self, **kwargs):
		logger.debug('[GET_PARTY_INFO] - Function called.')
		ret = await self.dbh.get_party_info(user_id = kwargs.get('user_id', None))

		logger.debug('[GET_PARTY_INFO] - Return obtained.')
		return ret

	@access_control
	async def get_producer_waste_total(self, producer_id, start_date=None, end_date=None, **kwargs):
		logger.debug('[GET_PRODUCER_WASTE_TOTAL] - Function called.')
		ret = await self.dbh.get_producer_waste_total(producer_id, start_date, end_date)

		logger.debug('[GET_PRODUCER_WASTE_TOTAL] - Return obtained.')
		return ret

	@access_control
	async def get_producer_real_bill(self, producer_id, **kwargs):
		logger.debug('[GET_PRODUCER_REAL_BILL] - Function called.')
		ret = await self.dbh.get_producer_real_bill(producer_id)

		logger.debug('[GET_PRODUCER_REAL_BILL] - Return obtained.')
		return ret

	@access_control
	async def get_producer_simulated_bill(self, producer_id, **kwargs):
		logger.debug('[GET_PRODUCER_SIMULATED_BILL] - Function called.')
		ret = await self.dbh.get_producer_simulated_bill(producer_id)

		logger.debug('[GET_PRODUCER_SIMULATED_BILL] - Return obtained.')
		return ret

	@access_control
	async def get_producer_real_bills(self, producer_id, months, **kwargs):
		logger.debug('[GET_PRODUCER_REAL_BILLS] - Function called.')
		ret = await self.dbh.get_producer_real_bills(producer_id, months)

		logger.debug('[GET_PRODUCER_REAL_BILLS] - Return obtained.')
		return ret

	@access_control
	async def get_producer_simulated_bills(self, producer_id, months, **kwargs):
		logger.debug('[GET_PRODUCER_SIMULATED_BILLS] - Function called.')
		ret = await self.dbh.get_producer_simulated_bills(producer_id, months)

		logger.debug('[GET_PRODUCER_SIMULATED_BILLS] - Return obtained.')
		return ret

	@access_control
	async def get_producer_day_average(self, producer_id, start_date=None, end_date=None, **kwargs):
		logger.debug('[GET_PRODUCER_DAY_AVERAGE] - Function called.')
		ret = await self.dbh.get_producer_day_average(producer_id, start_date, end_date)

		logger.debug('[GET_PRODUCER_DAY_AVERAGE] - Return obtained.')
		return ret

	@access_control
	async def get_producer_zone_day_average(self, producer_id, start_date=None, end_date=None, **kwargs):
		logger.debug('[GET_PRODUCER_ZONE_DAY_AVERAGE] - Function called.')
		ret = await self.dbh.get_producer_zone_day_average(producer_id, start_date, end_date)

		logger.debug('[GET_PRODUCER_ZONE_DAY_AVERAGE] - Return obtained.')
		return ret

	async def insert_garbage(self, timestamp, card, container, **kwargs):
		logger.debug('[INSERT_GARBAGE] - Function called.')
		ret = await self.dbh.insert_garbage(timestamp, card, container)

		logger.debug('[INSERT_GARBAGE] - Info added to database.')
		return ret

	async def insert_container(self, capacity, deposit_volume, lat, longt, weekly_collect_days=0, wastetype='I', cb_id=None, **kwargs):
		logger.debug('[INSERT_CONTAINER] - Function called.')
		ret = await self.dbh.insert_container(capacity, deposit_volume, lat, longt, weekly_collect_days, wastetype, cb_id)

		logger.debug('[INSERT_CONTAINER] - Info added to database.')
		return ret

	@access_control
	async def get_containers(self, **kwargs):
		logger.debug('[GET_CONTAINERS] - Function called.')
		ret = await self.dbh.get_containers()

		logger.debug('[GET_CONTAINERS] - Info added to database.')
		return ret

	async def get_week_day_highest_waste(self, nMonths, **kwargs):
		print('called')
		logger.debug('[GET_WEEK_DAY_HIGHEST_WASTE] - Function called.')
		ret = await self.dbh.get_week_day_highest_waste(nMonths)
		logger.debug('[GET_WEEKDAY_HIGHEST_WASTE] - Info retrieved from database.')
		return ret

	def build_date_format(self, input_str):
		a = parse(input_str, dayfirst=True)
		return a.year+'-'+a.month+'-'+a.day