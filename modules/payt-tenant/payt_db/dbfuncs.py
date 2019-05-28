import asyncio
import aiopg
import datetime as dt
from dateutil.relativedelta import relativedelta
from collections import OrderedDict
from .queries import QUERIES, APPEND_END_DATE
import inspect
import logging
from operator import itemgetter
from .caching import Cache

cache = Cache.get_global()

def setup_logger(name):
	global logger
	logger = logging.getLogger('%s.%s'%(name,__name__.split('.')[1]))

class DBfuncs(object):
	def __init__(self, name, host, port, dbname, user, password, rabbit_client):
		self.name = name
		setup_logger(name)
		self._dsn = 'dbname=%s user=%s password=%s host=%s port=%d'%\
					(dbname, user, password, host, port)
		self._pool = None
		self._listener = None
		self._list_conn = None
		self._updater = None
		self._updater_statistics = None
		self._client = rabbit_client

	async def init(self, notify_callback):
		global cache
		cache = await Cache.get_global().init()
		self._notify_callback = notify_callback
		self._pool = await aiopg.create_pool(self._dsn)
		self._list_conn = await self._pool.acquire()
		self._listener = asyncio.ensure_future(self.start_notification_listener())
		self._updater = asyncio.ensure_future(self.update_producer_table())
		self._updater_statistics = asyncio.ensure_future(self.update_statistics())


	async def start_notification_listener(self):
		while True:
			msg = await self._list_conn.notifies.get()
			await self._notify_callback(msg)
			logger.debug('Notification from DB: %s'%str(msg))

	async def update_statistics(self):
		await asyncio.sleep(300)
		logger.debug('Updating usage statistics for this county..')
		while True:
			mts = await self._execute(QUERIES['GET_COUNT_MONTH_WASTE_REC'])
			if mts[0][0] == 0:
				logger.debug('No records in database. Trying to build 12 months of statistics..')
				await self.calculate_waste_months(12)
				await self.calculate_waste_weeks(12)
				await self.calculate_waste_days(12)
			if dt.date.today().day == 1:
				logger.debug('Creating new record for each statistic record..')
				await self.calculate_waste_months(1)
				await self.calculate_waste_weeks(1)
				await self.calculate_waste_days(1)

			await asyncio.sleep(7200)
	
	async def update_producer_table(self):
		logger.debug('Producer table updater started..')
		while True:
			await self.build_producers_front_end()
			await asyncio.sleep(3600)

	async def listen(self, channel):
		async with self._list_conn.cursor() as cur:
			await cur.execute("LISTEN {}".format(channel))

	async def unlisten(self, channel):
		async with self._list_conn.cursor() as cur:
			await cur.execute("UNLISTEN {}".format(channel))

	async def notify(self, channel, msg):
		async with self._pool.acquire() as conn:
			async with conn.cursor() as cur:
				print('Send ->', msg)
				await cur.execute("NOTIFY {}, '{}'".format(channel, msg))

	async def _execute(self, query, parameters=None):
		async with self._pool.acquire() as conn:
			async with conn.cursor() as cur:
				try:
					await cur.execute(query, parameters)
					ret = []
					async for row in cur:
						ret.append(row)
					return ret
				except Exception as e:
					return None

	cache.cache_result(60)
	async def user_owns_producer(self, user_id, producer_id):
		logger.debug('[USER_OWNS_PRODUCER] - Function called.')
		producers = await self._execute(QUERIES['USER_PRODUCERS'], [user_id])
		logger.debug('[USER_OWNS_PRODUCER] - Info obtained from database.')
		return producer_id in [x[0] for x in producers]

	cache.cache_result(60)
	async def producer_card(self, producer_id):
		logger.debug('[PRODUCER_CARD] - Function called.')
		ret = await self._execute(QUERIES['PRODUCER_CARDS'], [producer_id])
		logger.debug('[PRODUCER_CARD] - Result retrieved from database.')
		if not ret: return None
		return ret

	cache.cache_result(60)
	async def get_producer_cards(self, producer_id):
		logger.debug('[GET_PRODUCER_CARDS] - Function called.')
		tmp = await self._execute(QUERIES['PRODUCER_CARDS'], [producer_id])
		if tmp:
			ret = []
			for t in tmp:
				ret.append(t[0])
			logger.debug('[GET_PRODUCER_CARDS] - Result retrieved from database.')
			return ret
		else:
			logger.debug('[GET_PRODUCER_CARDS] - No results found in database.')
			return []

	async def remove_all_cards(self, party_id):
		logger.debug('[REMOVE_ALL_CARDSS] - Function called.')
		res = await self._execute(QUERIES['GET_PID_PARTY'], [party_id])
		if res:
			producer_id = res[0][0]
		cards = await self.get_producer_cards(producer_id)
		if cards:
			for x in cards:
				await self.delete_producer_card(producer_id, x)
		
		logger.debug('[REMOVE_ALL_CARDSS] - Info updated in database.')

	async def producer_zone(self, producer_id):
		logger.debug('[PRODUCER_ZONE] - Function called.')
		ret = await self._execute(QUERIES['PRODUCER_ZONE'], [producer_id])
		logger.debug('[PRODUCER_ZONE] - Result retrieved from database.')
		if not ret: return None
		return ret[0][0]


	async def zone_id(self, zone_name):
		logger.debug('[ZONE_ID] - Function called.')
		ret = await self._execute(QUERIES['ZONE_ID'], [zone_name])
		logger.debug('[ZONE_ID] - Result retrieved from database.')
		if not ret: return None
		return ret[0][0]


	async def insert_zone(self, zone_name, location=None):
		logger.debug('[INSERT_ZONE] - Function called.')
		ret = await self._execute(QUERIES['INSERT_ZONE'], [zone_name, location])
		logger.debug('[INSERT_ZONE] - Info added to database.')
		if not ret: return None
		return ret[0][0]


	async def org_id(self, tax_id):
		logger.debug('[ORG_ID] - Function called.')
		ret = await self._execute(QUERIES['ORG_ID'], [tax_id])
		logger.debug('[ORG_ID] - Result retrieved from database.')
		if not ret: return None
		return ret[0][0]


	async def insert_org(self, name, tax_id, address_id=None):
		logger.debug('[INSERT_ORG] - Function called.')
		ret = await self._execute(QUERIES['INSERT_ORG'], [name, tax_id, address_id])
		logger.debug('[INSERT_ORG] - Info added to database.')
		if not ret: return None
		return ret[0][0]


	async def producer_exists(self, client_id, tax_id):
		logger.debug('[PRODUCER_EXISTS] - Function called.')
		ret = await self._execute(QUERIES['PRODUCER_CLIENT_EXISTS'], [client_id, tax_id])
		logger.debug('[PRODUCER_EXISTS] - Results retrieved from database.')
		if not ret: return None
		return ret[0][0]


	async def user_exists(self, user_id):
		logger.debug('[USER_EXISTS] - Function called.')
		ret = await self._execute(QUERIES['USER_EXISTS'], [user_id])
		logger.debug('[USER_EXISTS] - Result retrieved from database.')
		if not ret: return None
		return ret[0][0] != 0


	async def insert_producer(self, zone):
		logger.debug('[INSERT_PRODUCER] - Function called.')
		ret = await self._execute(QUERIES['INSERT_PRODUCER'], [zone])
		logger.debug('[INSERT_PRODUCER] - Info added to database.')
		if not ret: return None
		return ret[0][0]


	async def insert_user_person(self, user_id, person_id, ctype):
		logger.debug('[INSERT_USER_PERSON] - Function called.')
		res = await self._execute(QUERIES['INSERT_USER_P'], [user_id, person_id, ctype])
		logger.debug('[INSERT_USER_PERSON] - Info added to database.')


	async def insert_user_business(self, user_id, business_id, ctype):
		logger.debug('[INSERT_USER_BUSINESS] - Function called.')
		await self._execute(QUERIES['INSERT_USER_B'], [user_id, business_id, ctype])
		logger.debug('[INSERT_USER_BUSINESS] - Info added to database.')


	async def insert_garbage(self, timestamp, card, container):
		logger.debug('[INSERT_GARBAGE] - Function called.')
		container_id = await self._execute(QUERIES['GET_CONT_ID'], [container])
		if type(timestamp) is int:
			timestamp = dt.datetime.fromtimestamp(timestamp)
		await self._execute(QUERIES['INSERT_GARBAGE'], [timestamp, card, container_id[0][0]])
		logger.debug('[INSERT_GARBAGE] - Info added to database.')


	async def insert_container(self, capacity, deposit_volume, lat, longt, weekly_collect_days=0, wastetype='I', cb_id=None):
		logger.debug('[INSERT_CONTAINER] - Function called.')
		exists = await self._execute(QUERIES['CONTAINER_EXISTS'], [cb_id])
		if exists[0][0]:
			return None
		ret = await self._execute(QUERIES['GET_WASTE_ID'], [wastetype])
		if not ret: return None
		ret = await self._execute(QUERIES['INSERT_CONTAINER'], [capacity, deposit_volume, lat, longt, weekly_collect_days, ret[0][0], cb_id])
		logger.debug('[INSERT_CONTAINER] - Info added to databased.')


	async def insert_producer_container(self, producer, container):
		logger.debug('[INSERT_PRODUCER_CONTAINER] - Function called.')
		await self._execute(QUERIES['INSERT_P_CONTAINER'], [producer, container])
		logger.debug('[INSERT_PRODUCER_CONTAINER] - Info added to databased.')


	async def insert_card(self, card):
		logger.debug('[INSERT_CARD] - Function called.')
		exists = await self._execute(QUERIES['CARD_EXISTS'], [card])
		if exists[0][0]:
			logger.debug('[INSERT_CARD] - Card Already in Database.')
			return None
		else:
			logger.debug('[INSERT_CARD] - Card added to database.')
			await self._execute(QUERIES['PRODUCE_CARD_LOG_WP'], [card, 'ID Card adicionado ao sistema.'])
			await self._execute(QUERIES['INSERT_CARD'], [card])
			logger.debug('[INSERT_CARD] - Card insertion logged to database.')
			return 1


	async def exist_usages(self):
		logger.debug('[EXIST_USAGES] - Function called.')
		ret = await self._execute(QUERIES['EXIST_USAGES'])
		logger.debug('[EXIST_USAGES] - Result retrieved from database.')
		return ret[0][0]


	async def insert_producer_card(self, producer, card):
		logger.debug('[INSERT_PRODUCER_CARD] - Function called.')
		exists = await self._execute(QUERIES['CARD_EXISTS'], [card])
		if not exists:
			logger.debug('[INSERT_PRODUCER_CARD] - User does not exist.')
			return -1

		card_status = await self._execute(QUERIES['GET_CARD_STATUS'], [card])
		if card_status[0][0] != 1:
			logger.debug('[INSERT_PRODUCER_CARD] - Card already owned.')
			return -1
		# check if producer exists
		exists = await self._execute(QUERIES['PRODUCER_EXISTS'], [producer])
		if not exists:
			logger.debug('[INSERT_PRODUCER_CARD] - Producer does not exist.')
			await self._execute(QUERIES['INSERT_P_CARD'], [producer, producer])

		client_id = await self._execute(QUERIES['GET_CLIENT_ID'], [producer])
		await self._execute(QUERIES['PRODUCE_CARD_LOG'], [card, client_id, 'ID Card associado ao produtor.'])
		await self._execute(QUERIES['SET_CARD_STATUS'], [2, card])

		logger.debug('[INSERT_PRODUCER_CARD] - Info in database updated.')
		return await self._execute(QUERIES['INSERT_C_PRODUCER'], [producer, card])


	async def delete_producer_card(self, producer, card):
		logger.debug('[DELETE_PRODUCER_CARD] - Function called.')
		client_id = await self._execute(QUERIES['GET_CLIENT_ID'], [producer])
		await self._execute(QUERIES['PRODUCE_CARD_LOG'], [card, client_id, 'ID Card removido ao produtor.'])
		await self._execute(QUERIES['SET_CARD_STATUS'], [1, card])

		logger.debug('[DELETE_PRODUCER_CARD] - Info updated in database.')
		return await self._execute(QUERIES['DELETE_C_PRODUCER'], [card, producer])

	async def delete_card(self, card):
		logger.debug('[DELETE_CARD] - Function called.')
		await self._execute(QUERIES['PRODUCE_CARD_LOG_WP'], [card, 'ID Card removido do sistema.'])
		ret = await self._execute(QUERIES['DELETE_CARD'], [card])

		logger.debug('[DELETE_CARD] - Info removed in database.')


	async def insert_address(self, address, address2, parish, city, postal_code, alias=None):
		if alias:
			ret = await self._execute(QUERIES['INSERT_ADDRESS'], [address, address2, parish, city, postal_code, alias])
		else:
			ret = await self._execute(QUERIES['INSERT_ADDRESS'], [address, address2, parish, city, postal_code, address])
		if not ret: return None
		return ret[0][0]

	async def insert_person(self, name, tax_id, contract):
		ret = await self._execute(QUERIES['INSERT_PERSON'], [name, tax_id, contract])
		if not ret: return None
		return ret[0][0]

	async def person_id(self, tax_id):
		ret = await self._execute(QUERIES['PERSON_ID'], [tax_id])
		if not ret: return None
		return ret[0][0]

	async def party_id(self, client_id, tax_id):
		ret = await self._execute(QUERIES['PARTY_ID'], [str(client_id)])
		if not ret: return None
		return ret[0][0]

	async def insert_business(self, name, contract, activity, org_id):
		ret = await self._execute(QUERIES['INSERT_BUSINESS'], [name, contract, activity, org_id])
		if not ret: return None
		return ret[0][0]

	async def insert_producer_person(self, client_id, address_id, person_id, producer_id):
		ret = await self._execute(QUERIES['ISRT_PROD_P_PARTY'], [client_id, address_id, person_id, producer_id])
		if not ret: return None
		return ret[0][0]

	async def insert_producer_business(self, client_id, address_id, business_id, producer_id):
		ret = await self._execute(QUERIES['ISRT_PROD_B_PARTY'], [client_id, address_id, business_id, producer_id])
		if not ret: return None
		return ret[0][0]

	async def insert_real_bill(self, issue_date, value, party, period_begin, period_end):
		await self._execute(QUERIES['INSERT_REAL_BILL'], [issue_date, value, party, period_begin, period_end, issue_date, value, party, period_begin, period_end])

	async def insert_client_real_bill(self, client_id, tax_id, party, issue_date, value):
		party_id = await self.party_id(client_id, tax_id)
		if party_id:
			await self.insert_real_bill(issue_date, value, party_id)

	async def insert_simulated_bill(self, issue_date, value, party):
		await self._execute(QUERIES['INSERT_SIMU_BILL'], [issue_date, value, party, issue_date, value, party])

	async def insert_client_simulated_bill(self, client_id, tax_id, party, issue_date, value):
		party_id = await self.party_id(client_id, tax_id)
		if party_id:
			await self.insert_simulated_bill(issue_date, value, party_id)

	async def get_containers(self):
		ret = await self._execute(QUERIES['GET_CONTAINERS'])
		if ret:
			return [{
				"id": x[0],
				"capacity": x[1],
				"deposit_volume": x[2],
				"location": [x[3],x[4]],
				"weekly_collect_days": x[5],
				"waste_type": x[6],
			} for x in ret]
		return []

	async def get_party_info(self, **kwargs):
		logger.debug('[GET_PARTY_INFO] - Function called.')
		user_id = kwargs.get('user_id', None)
		if not user_id:
			return None

		party = await self._execute(QUERIES['PARTY_TYPE'], [user_id])
		if not party:
			return None

		party_info = {'type': party[0][2]}

		if party_info['type'] == 'personal':
			party_info['id'] = party[0][0]
			party_info_q = await self._execute(QUERIES['PERSON_INFO'], [party_info['id']])
			producers = await self._execute(QUERIES['PERSON_PRODUCERS'], [party_info['id']])

		elif party_info['type'] == 'business':
			party_info['id'] = party[0][1]
			party_info_q = await self._execute(QUERIES['BUSINESS_INFO'], [party_info['id']])
			producers = await self._execute(QUERIES['BUSINESS_PRODUCERS'], [party_info['id']])

		party_info['name'], party_info['contract'] = party_info_q[0]
		party_info['producers'] = []
		for x in producers:
			party_info['producers'].append({
				'id': x[0],
				'address': "%s %s"%(x[1], x[2]),
				'alias': x[3],
				'model': x[4]
			})

		logger.debug('[GET_PARTY_INFO] - Results retrieved from database.')
		return party_info

	async def internal_get_party_info(self, **kwargs):
		user_id = kwargs.get('user_id', None)
		if not user_id:
			return None

		party = await self._execute(QUERIES['PARTY_TYPE'], [user_id])
		if not party:
			return None

		party_info = {'type': party[0][2]}

		if party_info['type'] == 'personal':
			party_info['id'] = party[0][0]
			party_info_q = await self._execute(QUERIES['PERSON_INFO'], [party_info['id']])
			producers = await self._execute(QUERIES['PERSON_PRODUCERS'], [party_info['id']])

		elif party_info['type'] == 'business':
			party_info['id'] = party[0][1]
			party_info_q = await self._execute(QUERIES['BUSINESS_INFO'], [party_info['id']])
			producers = await self._execute(QUERIES['BUSINESS_PRODUCERS'], [party_info['id']])

		party_info['name'], party_info['contract'] = party_info_q[0]
		party_info['producers'] = []
		for x in producers:
			party_info['producers'].append({
				'id': x[0],
				'address': "%s %s"%(x[1], x[2]),
				'alias': x[3],
				'model': x[4]
			})

		return party_info

	async def get_producer_waste_total(self, producer_id, start_date=None, end_date=None):
		card = await self.producer_card(producer_id)

		parameters = [start_date if start_date else dt.date.today().replace(day=1)]
		if end_date:
			parameters.append(end_date)
		
		ret = []
		if card:
			#parameters = [card] + parameters
			query = QUERIES['CARD_MONTH_WASTE'].format(APPEND_END_DATE if end_date else '')
			tmp = []
			for i in card:
				tmp.append(await self._execute(query, [i[0]]+parameters))
			for x in tmp:
				for y in x:
					ret.append(y)
		else:
			parameters = [producer_id] + parameters
			query = QUERIES['CONTAINER_MONTH_WASTE'].format(APPEND_END_DATE if end_date else '')
			ret = await self._execute(query, parameters)
		
		totals = OrderedDict()
		for d,w,v in ret:
			month = d.strftime("%Y-%m")
			if month not in totals:
				totals[month] = dict()
				totals[month]['TOTAL'] = 0
			totals[month][w] = float(v)
			totals[month]['TOTAL'] += totals[month][w]
		
		return [{'date': k, 'waste': v} for k,v in totals.items()]


	async def get_producer_real_bill(self, producer_id):
		parameters = [producer_id, (dt.date.today() - dt.timedelta(365/12)).replace(day=1)] #TODO: review this

		ret = await self._execute(QUERIES['PRODUCER_REAL_BILL'], parameters)

		return {
			'issue_date': str(ret[0][0]),
			'value': float(ret[0][1]),
			'period_begin': str(ret[0][2]),
			'period_end': str(ret[0][3])
		} if ret else None

	async def get_producer_real_bills(self, producer_id, n=12):

		parameters = [producer_id, (dt.date.today() - dt.timedelta(n*365/12)).replace(day=1)] #TODO: review this

		ret = await self._execute(QUERIES['PRODUCER_REAL_BILLS'], parameters)

		return [{
				'issue_date': str(bill[0]),
				'value': float(bill[1]),
				'period_begin': str(ret[0][2]),
				'period_end': str(ret[0][3])
		} for bill in ret]

	async def get_producer_simulated_bill(self, producer_id):
		parameters = [producer_id, (dt.date.today() - dt.timedelta(365/12)).replace(day=1)] #TODO: review this

		ret = await self._execute(QUERIES['PRODUCER_SIMULATED_BILL'], parameters)

		return {
			'issue_date': str(ret[0][0]),
			'value': float(ret[0][1])
		} if ret else None

	async def get_producer_simulated_bills(self, producer_id, n=12):

		parameters = [producer_id, (dt.date.today() - dt.timedelta(n*365/12)).replace(day=1)] #TODO: review this

		ret = await self._execute(QUERIES['PRODUCER_SIMULATED_BILLS'], parameters)

		return [{
				'issue_date': str(bill[0]),
				'value': float(bill[1])
		} for bill in ret]

	async def get_producer_day_average(self, producer_id, start_date=None, end_date=None):
		card = await self.producer_card(producer_id)

		parameters = [start_date if start_date else dt.date.today().replace(day=1)]
		if end_date:
			parameters.append(end_date)
		
		ret = []
		if card:
			#parameters = [card] + parameters
			query = QUERIES['CARD_DAY_AVERAGE'].format(APPEND_END_DATE if end_date else '')
			tmp = []
			for i in card:
				tmp.append(await self._execute(query, [i[0]]+parameters))
			for x in tmp:
				for y in x:
					ret.append(y)
		else:
			parameters = [producer_id] + parameters
			query = QUERIES['CONTAINER_DAY_AVERAGE'].format(APPEND_END_DATE if end_date else '')
			ret = await self._execute(query, parameters)

		totals = dict()
		for w,v in ret:
			totals[w] = float(v)
		totals['TOTAL'] = sum([v for w,v in totals.items()])

		return totals

	async def get_producer_zone_day_average(self, producer_id, start_date=None, end_date=None):

		zone = await self.producer_zone(producer_id)
		print(zone)
		if not zone: return None

		card = await self.producer_card(producer_id)
		print(card)
		parameters = [zone, start_date if start_date else dt.date.today().replace(day=1)]
		if end_date:
			parameters.append(end_date)

		if card:
			query = QUERIES['CARD_ZONE_DAY_AVERAGE'].format(APPEND_END_DATE if end_date else '')
		else:
			query = QUERIES['CONTAINER_ZONE_DAY_AVERAGE'].format(APPEND_END_DATE if end_date else '')

		ret = await self._execute(query, parameters)
		totals = dict()
		if not ret:
			totals = {}
			totals['TOTAL'] = 0
			return totals
		print(ret)
		for w,v in ret:
			totals[w] = float(v)
		totals['TOTAL'] = sum([v for w,v in totals.items()])
		print(totals)
		return totals

	async def calculate_waste_months(self, nMonths):
		logger.debug('[CALCULATE_WASTE_MONTHS] - Function called.')
		party = await self.get_producers()
		total = []

		today = dt.date.today()
		end_dt = today - relativedelta(days=today.day)
		start_dt = end_dt - relativedelta(months=nMonths)

		for x in party:
			u_id = x['id']
			if x['producers']:
				for z in x['producers']:
					p_id = z['id']
					tmp = await self.get_producer_waste_total(p_id, start_dt, end_dt)
					if tmp:
						for y in tmp:
							if total == []:
								total.append({'date': y['date'], 'waste': y['waste']['TOTAL']})
							else:
								if list(filter(lambda l: l['date'] == y['date'], total)):
									i = list(map(itemgetter('date'), total)).index(y['date'])
									total[i]['waste'] += y['waste']['TOTAL']
								else:
									total.append({'date': y['date'], 'waste': y['waste']['TOTAL']})
			total = sorted(total, key = lambda k: k['date'])
		
		if total == []:
			logger.debug('[CALCULATE_WASTE_MONTHS] - Not possible to calculate.')
			return -1
		
		for x in total:
			await self._execute(QUERIES['INSERT_MONTH_WASTE'], [x['date'], x['waste']])
		
		logger.debug('[CALCULATE_WASTE_MONTHS] - Info added to database.')
		return 1

	cache.cache_result(60)
	async def get_party_type(self, userid):
		tmp = await self._execute(QUERIES['GET_PARTY_TYPE'], [userid])
		if tmp:
			return tmp[0][0]
		else:
			return None

	async def build_producers_front_end(self, **kwargs):
		# clean existing table
		await self._execute(QUERIES['DROP_TABLE_PU'])

		ids = await self._execute(QUERIES['GET_ALL_PERSON_IDS'])
		ret = {}
		data = []
		for x in ids:
			userid = x[0]
			status = await self._client.call('payt.auth.internal.get_user_status',userid,exchange='auth')
			t = await self.internal_get_party_info(user_id=userid)
			email = await self._client.call('payt.auth.internal.get_email',userid,exchange='auth')
			for y in t['producers']:
				tp = await self.get_party_type(userid)
				res = await self._execute(QUERIES['INSERT_TO_PU'], [userid, status, t['name'], y['id'], t['contract'], y['address'], y['model'], tp, email])

		logger.debug('PRODUCERS TABLE FOR FRONT END BUILT.')

	cache.cache_result(60)
	async def get_producers_front_end(self, page, nelements):
		check = await self._execute(QUERIES['COUNT_PROD_USERS'])
		
		if check:
			if check[0][0] == 0:
				logger.debug('BUILDING TABLE FOR FRONT ENT PRESENTATION..')
				await self.build_producers_front_end()

		if page:
			limit = nelements
			offset = (page-1)*limit
		else:
			limit = None
			offset = None

		sel = await self._execute(QUERIES['SELECT_UP'], [limit, offset])

		ret = {}
		ret['data'] = []
		count = await self._execute(QUERIES['COUNT_PROD_USERS'])
		if count:
			ret['totalDataSize'] = count[0][0]
		else:
			ret['totalDataSize'] = 0

		if sel:
			for x in sel:
				data = {}
				data['producer'] = {}
				data['user_id'] = x[0]
				data['name'] = x[2]
				data['producer']['p_id'] = x[3]
				data['contract'] = x[4]
				data['producer']['address'] = x[5]
				data['producer']['model'] = x[6]
				data['producer']['type'] = x[7]
				data['email'] = x[8]
				data['last_access'] = await self._client.call('payt.auth.internal.get_last_access',x[0],exchange='auth')
				if data['last_access'] != 'N/D' and x[1] == 'unvalidated':
					data['status'] = 'validated'
				else:
					data['status'] = x[1]

				ret['data'].append(data)
		return ret

	cache.cache_result(60)
	async def get_producers_front_end_results(self, page, nelements, search, **kwargs):
		check = await self._execute(QUERIES['COUNT_PROD_USERS'])
		logger.debug('GET_PRODUCERS_FRONT_END_RESULTS CALLED.')
		logger.debug('Searching for: %s'%search)
		if check[0][0] == 0:
			logger.debug('Building Table for Front end Presentation..')
			await self.build_producers_front_end()

		if page:
			limit = nelements
			offset = (page-1)*limit
		else:
			limit = None
			offset = None

		sel = await self._execute(QUERIES['SELECT_UP_SEARCH'], ['%'+search+'%', '%'+search+'%', '%'+search+'%', limit, offset])
		ret = {}
		ret['data'] = []
		count = await self._execute(QUERIES['COUNT_PROD_USERS_RES'], ['%'+search+'%', '%'+search+'%', '%'+search+'%'])
		ret['totalDataSize'] = count[0][0]
		logger.debug('Search results obtained.')
		for x in sel:
			data = {}
			data['producer'] = {}
			data['user_id'] = x[0]
			data['status'] = x[1]
			data['name'] = x[2]
			data['producer']['p_id'] = x[3]
			data['contract'] = x[4]
			data['producer']['address'] = x[5]
			data['producer']['model'] = x[6]
			data['producer']['type'] = x[7]
			data['email'] = x[8]
			data['last_access'] = await self._client.call('payt.auth.internal.get_last_access',x[0],exchange='auth')

			ret['data'].append(data)

		logger.debug('Search results data object built.')

		return ret

	async def get_producers(self, **kwargs):
		ids = await self._execute(QUERIES['GET_ALL_PERSON_IDS'])
		ret = []

		for x in ids:
			ret.append(await self.internal_get_party_info(user_id=x[0]))
		
		return ret

	async def get_month_highest_waste(self):
		logger.debug('[GET_MONTH_HIGHEST_WASTE] - Function called.')
		db_res = await self._execute(QUERIES['GET_MONTH_HIGHEST_WASTE'])
		logger.debug('[GET_MONTH_HIGHEST_WASTE] - Result retrieved from database.')
		ret = {}
		
		if db_res:
			tmp = db_res[0][0]
			year = tmp.split('-')[0]
			month = tmp.split('-')[1]
			
			ret['year'] = year
			ret['month'] = month

			logger.debug('[GET_MONTH_HIGHEST_WASTE] - Return built.')
			return ret
		else:
			logger.debug('[GET_MONTH_HIGHEST_WASTE] - Nothing retrieved from database.')
			return None

	async def get_producer_weekly_waste_total(self, producer_id, start_date=None, end_date=None):
		card = await self.producer_card(producer_id)

		parameters = [start_date if start_date else dt.date.today().replace(day=1)]
		if end_date:
			parameters.append(end_date)

		ret = []
		if card:
			#parameters = [card] + parameters
			query = QUERIES['CARD_WEEK_WASTE'].format(APPEND_END_DATE if end_date else '')
			tmp = []
			for i in card:
				tmp.append(await self._execute(query, [i[0]]+parameters))
			for x in tmp:
				for y in x:
					ret.append(y)
		else:
			parameters = [producer_id] + parameters
			query = QUERIES['CONTAINER_WEEK_WASTE'].format(APPEND_END_DATE if end_date else '')
			ret = await self._execute(query, parameters)

		totals = OrderedDict()
		for d,w,v in ret:
			week = d.strftime("%Y-%U")
			if week not in totals:
				totals[week] = dict()
				totals[week]['TOTAL'] = 0
			tmp = float(v)
			totals[week]['TOTAL'] += tmp
		
		return [{'date': k, 'waste': v} for k,v in totals.items()]

	async def get_producer_waste_weeks(self, nMonths):
		party = await self.get_producers()
		total = []
		
		if nMonths == -1:
			today = dt.date.today()
			end_dt = today - relativedelta(days=today.day)
			start_dt = end_dt - relativedelta(days=end_dt.day-1)
		else:
			end_dt = dt.date.today()
			start_dt = end_dt - relativedelta(months=nMonths)

		for x in party:
			u_id = x['id']

			for z in x['producers']:
				p_id = z['id']
				tmp = await self.get_producer_weekly_waste_total(p_id, start_dt, end_dt)
				if tmp != None:
					for y in tmp:
						if total == []:
							total.append({'date': y['date'], 'waste': y['waste']['TOTAL']})
						else:
							if list(filter(lambda l: l['date'] == y['date'], total)):
								i = list(map(itemgetter('date'), total)).index(y['date'])
								total[i]['waste'] += y['waste']['TOTAL']
							else:
								total.append({'date': y['date'], 'waste': y['waste']['TOTAL']})
		return total

	async def calculate_waste_weeks(self, nMonths):
		logger.debug('[CALCULATE_WASTE_WEEKS] - Function called.')
		all_data = await self.get_producer_waste_weeks(nMonths)
		ret = {}
		if all_data:
			for x in all_data:
				ret[x['date']] = {}
				ret[x['date']]['week_start'] = dt.datetime.strptime(x['date'] + '-0', "%Y-%W-%w").date().strftime("%d/%m/%y")
				ret[x['date']]['week_end'] = (dt.datetime.strptime(x['date'] + '-0', "%Y-%W-%w").date() + relativedelta(weeks=1)).strftime("%d/%m/%y")
				ret[x['date']]['waste'] = x['waste']
		else:
			logger.debug('[CALCULATE_WASTE_WEEKS] - Not possible to calculate.')
			return -1

		# insert to db
		for x in ret:
			await self._execute(QUERIES['INSERT_WEEK_WASTE'], [ret[x]['week_start'], ret[x]['week_end'], int(ret[x]['waste']), x])
		logger.debug('[CALCULATE_WASTE_WEEKS] - Data inserted in database.')
		return 1

	async def get_weeks_highest_waste_n(self, nMonths):
		logger.debug('[GET_WEEKS_HIGHEST_WASTE_N] - Function called.')
		ret = {}

		db_res = await self._execute(QUERIES['GET_WEEK_WASTE'], [nMonths])
		logger.debug('[GET_WEEKS_HIGHEST_WASTE_N] - Return retrieved from database.')

		if db_res:
			for x in db_res:
				ret['date'] = {}
				ret['date']['week_start'] = x[0]
				ret['date']['week_end'] = x[1]
				ret['date']['waste'] = x[2]

			logger.debug('[GET_WEEKS_HIGHEST_WASTE_N] - Return built.')
			return ret
		else:
			logger.debug('[GET_WEEKS_HIGHEST_WASTE_N] - Nothing retrieved from database.')
			return None

	async def get_week_highest_waste_last(self):
		logger.debug('[GET_WEEKS_HIGHEST_WASTE_LAST] - Function called.')
		db_res = await self._execute(QUERIES['GET_WEEK_HIGHEST_WASTE'])
		logger.debug('[GET_WEEKS_HIGHEST_WASTE_LAST] - Return retrieved from database.')

		if db_res:
			ret = {}
			ret['week_start'] = db_res[0][0]
			ret['week_end'] = db_res[0][1]
			ret['waste'] = db_res[0][2]

			logger.debug('[GET_WEEKS_HIGHEST_WASTE_LAST] - Return build.')
			return ret
		else:
			logger.debug('[GET_WEEKS_HIGHEST_WASTE_LAST] - Nothing retrieved from database.')
			return None


	async def get_producer_daily_waste_total(self, producer_id, start_date=None, end_date=None):
		card = await self.producer_card(producer_id)

		parameters = [start_date if start_date else dt.date.today().replace(day=1)]
		if end_date:
			parameters.append(end_date)

		ret = []
		if card:
			query = QUERIES['CARD_DAY_WASTE'].format(APPEND_END_DATE if end_date else '')
			tmp = []
			for i in card:
				tmp.append(await self._execute(query, [i[0]]+parameters))
			for x in tmp:
				for y in x:
					ret.append(y)
		else:
			parameters = [producer_id] + parameters
			query = QUERIES['CONTAINER_DAY_WASTE'].format(APPEND_END_DATE if end_date else '')
			ret = await self._execute(query, parameters)

		totals = OrderedDict()
		for d,w,v in ret:
			day = d.strftime("%Y-%m-%d")
			if day not in totals:
				totals[day] = dict()
				totals[day]['TOTAL'] = 0
			tmp = float(v)
			totals[day]['TOTAL'] += tmp
		return [{'date': k, 'waste': v} for k,v in totals.items()]

	async def get_producer_waste_days(self, nMonths):
		party = await self.get_producers()
		total = []
		
		if nMonths == -1:
			today = dt.date.today()
			end_dt = today - relativedelta(days=today.day)
			start_dt = end_dt - relativedelta(days=end_dt.day-1)
		else:
			end_dt = dt.date.today()
			start_dt = end_dt - relativedelta(months=nMonths)

		for x in party:
			u_id = x['id']

			for z in x['producers']:
				p_id = z['id']
				tmp = await self.get_producer_daily_waste_total(p_id, start_dt, end_dt)

				if tmp != None:
					for y in tmp:
						if total == []:
							total.append({'date': y['date'], 'waste': y['waste']['TOTAL']})
						else:
							if list(filter(lambda l: l['date'] == y['date'], total)):
								i = list(map(itemgetter('date'), total)).index(y['date'])
								total[i]['waste'] += y['waste']['TOTAL']
							else:
								total.append({'date': y['date'], 'waste': y['waste']['TOTAL']})
		return total

	async def get_day_highest_waste(self):
		logger.debug('[GET_DAYS_HIGHEST_WASTE] - Function called.')
		db_res = await self._execute(QUERIES['GET_DAY_HIGHEST_WASTE'])			
		logger.debug('[GET_DAYS_HIGHEST_WASTE] - Return retrieved from database.')

		if db_res:
			ret = {}
			ret['day'] = db_res[0]
			ret['waste'] = db_res[1]
			ret['month'] = db_res[2]
			logger.debug('[GET_DAYS_HIGHEST_WASTE] - Return built.')
			return ret
		else:
			logger.debug('[GET_DAYS_HIGHEST_WASTE] - Nothing returned from database.')
			return None

	async def get_days_highest_waste(self, nMonths):
		logger.debug('[GET_DAYS_HIGHEST_WASTE] - Function called.')
		ret = {}
		db_res = await self._execute(QUERIES['GET_DAY_WASTE'], [nMonths])
		logger.debug('[GET_DAYS_HIGHEST_WASTE] - Return retrieved from database.')

		if db_res:
			for x in db_res:
				ret[x[0]] = {}
				ret[x[0]]['waste'] = x[1]
				ret[x[0]]['month'] = x[2]
			logger.debug('[GET_DAYS_HIGHEST_WASTE] - Return built.')		
			return ret
		else:
			logger.debug('[GET_DAYS_HIGHEST_WASTE] - Nothing returned from database.')
			return None

	async def calculate_waste_days(self, nMonths):
		logger.debug('[CALCULATE_WASTE_DAYS] - Function called.')
		all_data = await self.get_producer_waste_days(nMonths)
		print(all_data)
		if all_data:
			for x in all_data:
				tmp = x['date']
				month_year = tmp.split('-')[0] + tmp.split('-')[1]
				await self._execute(QUERIES['INSERT_DAY_WASTE'], [x['date'], month_year, int(x['waste'])])
		else:
			logger.debug('[CALCULATE_WASTE_DAYS] - Not possible to calculate.')
			return -1
		
		logger.debug('[CALCULATE_WASTE_DAYS] - Info added to database.')
		return 1

	async def get_week_day_highest_waste(self, nMonths=6, **kwargs):
		all_data = await self.get_producer_waste_days(nMonths)
		if all_data == []:
			return -1

		week = {0:{'count':0, 'w':0},
			1:{'count':0, 'w':0},
			2:{'count':0, 'w':0},
			3:{'count':0, 'w':0},
			4:{'count':0, 'w':0},
			5:{'count':0, 'w':0},
			6:{'count':0, 'w':0}}
		
		for x in all_data:
			day = dt.datetime.strptime(x['date'], '%Y-%M-%d').weekday()
			week[day]['count'] = (week[day]['count'])+1
			week[day]['w'] = week[day]['w'] + x['waste']
		ret = 0
		for y in week:
			if week[y]['count'] > ret:
				ret = y
	
		return ret

	async def get_container_garbage_day(self, container):
		exists = await self._execute(QUERIES['CONTAINER_EXISTS'], [container])
		if exists[0][0]:
			date = dt.date.today() - relativedelta(days=1)
			qres = await self._execute(QUERIES['CONTAINER_TOTAL_DAY'], [container, date.strftime('%Y-%m-%d')])
			return qres[0][0]
		else:
			return 0

	async def get_container_garbage_week(self, container):
		exists = await self._execute(QUERIES['CONTAINER_EXISTS'], [container])
		if exists[0][0]:
			end = dt.date.today()
			start = end - relativedelta(days=7)
			qres = await self._execute(QUERIES['CONTAINER_TOTAL_INTERVAL'], [container, start.strftime('%Y-%m-%d'), end.strftime('%Y-%m-%d')])
			return qres[0][0]
		else:
			return 0

	async def get_container_garbage_months(self, container, nMonths):
		logger.debug('[GET_CONTAINER_GARBAGE_MONTHS] - Function called.')
		exists = await self._execute(QUERIES['CONTAINER_EXISTS'], [container])
		if exists[0][0]:
			end = dt.date.today()
			start = end - relativedelta(months=nMonths)
			qres = await self._execute(QUERIES['CONTAINER_TOTAL_INTERVAL'], [container, start.strftime('%Y-%m-%d'), end.strftime('%Y-%m-%d')])
			logger.debug('[GET_CONTAINER_GARBAGE_MONTHS] - Result retrieved from database.')
			return qres[0][0]
		else:
			logger.debug('[GET_CONTAINER_GARBAGE_MONTHS] - Result (ZERO) retrieved from database.')
			return 0

	async def get_containers_usage(self):
		logger.debug('[GET_CONTAINERS_USAGE] - Function called.')
		ids = await self._execute(QUERIES['GET_CONTAINERS_ID'])
		ret = {}
		for x in ids:
			ret[x[0]] = {}
			ret[x[0]]['col1'] = await self.get_container_garbage_day(x[0])
			ret[x[0]]['col2'] = await self.get_container_garbage_week(x[0])
			ret[x[0]]['col3'] = await self.get_container_garbage_months(x[0], 1)
			ret[x[0]]['col4'] = await self.get_container_garbage_months(x[0], 6)
		logger.debug('[GET_CONTAINERS_USAGE] - Result retrieved from database.')

		return ret

	async def get_container_usage_by_month(self, container, nMonths=6):
		logger.debug('[GET_CONTAINER_USAGE_BY_MONTH] - Function called.')
		start = dt.date.today() - relativedelta(months=nMonths)
		ret = {}

		for i in range(nMonths):
			end = start + relativedelta(months=1)
			count = await self._execute(QUERIES['CONTAINER_TOTAL_INTERVAL'], [container, start.strftime('%Y-%m-%d'), end.strftime('%Y-%m-%d')])
			ret[start.strftime('%Y-%m')] = count[0][0]
			start = start + relativedelta(months=1)

		logger.debug('[GET_CONTAINER_USAGE_BY_MONTH] - Result retrieved from database.')
		return ret

	async def get_total_simulated_bill(self):
		logger.debug('[GET_TOTAL_SIMULATED_BILL] - Function called.')
		res = await self._execute(QUERIES['TOTAL_SIM_LASTM'])
		if res:
			logger.debug('[GET_TOTAL_SIMULATED_BILL] - Result retrieved from database.')
			return res[0][0]
		else:
			logger.debug('[GET_TOTAL_SIMULATED_BILL] - Result (ZERO) retrieved from database.')
			return 0

	async def get_total_real_bill(self):
		logger.debug('[GET_TOTAL_REAL_BILL] - Function called.')
		res = await self._execute(QUERIES['TOTAL_REAL_LASTM'])
		
		if res:
			logger.debug('[GET_TOTAL_REAL_BILL] - Result retrieved from database.')
			return res[0][0]
		else:
			logger.debug('[GET_TOTAL_REAL_BILL] - Result (ZERO) retrieved from database.')
			return 0

	async def get_id_cards(self, page, nelements):
		logger.debug('[GET_ID_CARDS] - Function called.')
		limit = nelements
		offset = (page-1)*limit
		res = await self._execute(QUERIES['GET_ID_CARDS_PAG'], [limit, offset])
		if res:
			ret = []
			for x in res:
				tmp = {}
				tmp['card'] = x[0]
				tmp['owner'] = {}
				own = await self._execute(QUERIES['GET_CARD_OWNER'], [x[0]])
				if own:
					name = await self._execute(QUERIES['GET_PRODUCER_NAME'], [own[0][0]])
					if not name:
						name = await self._execute(QUERIES['GET_PRODUCER_NAME_BUS'], [own[0][0]])
					tmp['owner']['name'] = name[0][0]
					t = await self._execute(QUERIES['GET_PRODUCER_ADDRESS'], [own[0][0]])
					if t:
						tmp['owner']['address'] = t[0][0]
						tmp['owner']['city'] = t[0][1]
						tmp['owner']['zipcode'] = t[0][2]
				
				ret.append(tmp)
			obj = {}
			obj['data'] = ret
			obj['totalDataSize'] = len(await self._execute(QUERIES['GET_ID_CARDS']))
			logger.debug('[GET_ID_CARDS] - Result retrieved from database.')
			return obj
		else:
			logger.debug('[GET_ID_CARDS] - Result (ZERO) retrieved from database.')
			return []

	async def get_free_id_cards(self, page, nelements):
		logger.debug('[GET_FREE_ID_CARDS] - Function called.')
		limit = nelements
		offset = (page-1)*limit
		res = await self._execute(QUERIES['GET_FREE_ID_CARDS_PAG'], [limit, offset])
		ret = []
		if res:
			for x in res:
				ret.append(x[0])

		obj = {}
		obj['data'] = ret
		obj['totalDataSize'] = len(await self._execute(QUERIES['GET_ID_CARDS']))
		logger.debug('[GET_FREE_ID_CARDS] - Result retrieved from database.')
		return obj

	cache.cache_result(60)
	async def get_count_validated(self):
		logger.debug('[GET_COUNT_VALIDATED] - Function called.')
		count = await self._execute(QUERIES['COUNT_PROD_USERS'])
		if count[0][0] == 0:
			return {'perc': 0.0, 'total': 0}

		perc = 0.0
		validated = await self._execute(QUERIES['COUNT_VALIDATED'])
		perc = (validated[0][0]/count[0][0])*100
		logger.debug('[GET_COUNT_VALIDATED] - Result retrieved from database.')
	
		ret = {'perc': perc, 'total': validated[0][0]}
		return ret

	async def edit_address_alias(self, producer_id, new_alias):
		logger.debug('[EDIT_ADDRESS_ALIAS] - Function called.')
		ret = await self._execute(QUERIES['EDIT_ALIAS'], [new_alias, producer_id])
		logger.debug('[EDIT_ADDRESS_ALIAS] - Info updated in database.')
		return ret

	async def get_producer_add_alias(self, producer_id):
		logger.debug('[GET_PRODUCER_ADD_ALIAS] - Function called.')
		ret = await self._execute(QUERIES['GET_ALIAS'], [producer_id])
		logger.debug('[GET_PRODUCER_ADD_ALIAS] - Result retrieved from database.')
		return ret[0][0]

	async def search_address(self, search_term):
		logger.debug('[SEARCH_ADDRESS] - Function called.')
		st = '%'+search_term+'%'
		r1 = await self._execute(QUERIES['SEARCH_PERSON_ADDRESS'], [st])
		r2 = await self._execute(QUERIES['SEARCH_BUS_ADDRESS'], [st])
		ret = []
		if r1:
			for x in r1:
				ret.append(x[0])
		if r2:
			for y in r2:
				ret.append(y[0])

		logger.debug('[SEARCH_ADDRESS] - Result retrieved from database.')
		return ret

	async def search_name(self, search_term):
		logger.debug('[SEARCH_NAME] - Function called.')
		st = '%'+search_term+'%'
		r1 = await self._execute(QUERIES['SEARCH_PERSON_NAME'], [st])
		r2 = await self._execute(QUERIES['SEARCH_BUS_NAME'], [st])

		ret = []
		if r1:
			for x in r1:
				ret.append(x[0])
		if r2:
			for y in r2:
				ret.append(y[0])

		logger.debug('[SEARCH_NAME] - Result retrieved from database.')
		return ret

	async def set_last_access(self, user_id):
		logger.debug('[SET_LAST_ACCESS] - Function called.')
		await self._execute(QUERIES['SET_LAST_ACCESS'], [user_id])
		logger.debug('[SET_LAST_ACCESS] - User %s Last Access Set.'%(user_id))
		return 1

	async def get_card_logs(self, card_id):
		logger.debug('[GET_CARD_LOGS] - Function called.')
		res = await self._execute(QUERIES['GET_CARD_LOGS'], [card_id])
		logger.debug('[GET_CARD_LOGS] - Results retrieved from database.')
		ret = []

		logger.debug('[GET_CARD_LOGS] - Building data object..')	
		if res:
			for x in res:
				data = {}
				if x[0] == 0:
					data['producer'] = 'None'
				else:
					data['producer'] = x[0]
				data['timestamp'] = x[1].strftime('%d-%m-%Y %H:%M')
				data['message'] = x[2]

				ret.append(data)

		logger.debug('[GET_CARD_LOGS] - Data object built. Sending to front end.')
		return ret

	cache.cache_result(60)
	async def get_user_role(self, user_id):
		logger.debug('[GET_USER_ROLE] - Function called.')
		role = await self._client.call('payt.auth.internal.get_role',user_id,exchange='auth')
		if role:
			return role
		else:
			role = '-'

		logger.debug('[GET_USER_ROLE] - Result retrieved from database.')
		return role

	async def set_mailing_option(self, user_id, option):
		logger.debug('[SET_MAILING_OPTION] - Function called.')
		if option:
			await self._execute(QUERIES['SET_MAILING'], [user_id])
		else:
			await self._execute(QUERIES['SET_NO_MAILING'], [user_id])
		logger.debug('[GET_UNACTIVE_PRODUERS_IDS] - Info updated in database.')

	async def get_unactive_producers_ids(self):
		logger.debug('[GET_UNACTIVE_PRODUERS_IDS] - Function called.')

		res = await self._execute(QUERIES['GET_UNACTIVE_PROD'])
		ret = []
		if res:
			for x in res:
				ret.append(x[0])
		logger.debug('[GET_UNACTIVE_PRODUERS_IDS] - Results obtained form Database.')

		return ret

	async def get_user_from_producer(self, p_id):
		logger.debug('[GET_USER_FROM_PRODUCER] - Function called.')
		res = await self._execute(QUERIES['GET_USER_ID_PROD'], [p_id])

		logger.debug('[GET_USER_FROM_PRODUCER] - Results obtained form Database.')
		if res:
			return res[0][0]
		else:
			return None

	async def set_ended(self, p_id):
		logger.debug('[SET_ENDED] - Function called.')
		res = await self._execute(QUERIES['GET_LAST_BILL'], [p_id])
		end = res[0][0] + relativedelta(months=1)
		await self._execute(QUERIES['SET_PRODUCER_END'], [end, p_id])
		logger.debug('[SET_ENDED] - Data updated in Database.')

	async def ckan_total_rbill(self):
		ret = []
		res = await self._execute(QUERIES['CKAN_TOTAL_RBILL'])
		if res:
			for x in res:
				data = {}
				data['month'] = x[0]
				data['year'] = x[1]
				data['value'] = float(x[2])

				ret.append(data)
		else:
			return None

		logger.debug('[CKAN] Real bills sent to portal')
		return ret

	async def ckan_total_sbill(self):
		ret = []
		res = await self._execute(QUERIES['CKAN_TOTAL_SBILL'])
		if res:
			for x in res:
				data = {}
				data['month'] = x[0]
				data['year'] = x[1]
				data['value'] = float(x[2])

				ret.append(data)
		else:
			return None

		logger.debug('[CKAN] Simulated bills sent to portal')
		return ret

	async def ckan_total_person(self):
		res = await self._execute(QUERIES['CKAN_TOTAL_PERSON'])
		if res:
			logger.debug('[CKAN] Total person users sent to portal')
			return res[0][0]
		else:
			return 0

	async def ckan_total_business(self):
		res = await self._execute(QUERIES['CKAN_TOTAL_BUSINESS'])
		if res:
			logger.debug('[CKAN] Total business users sent to portal')
			return res[0][0]
		else:
			return 0

	async def ckan_containers_info(self):
		ret = []
		res = await self._execute(QUERIES['CKAN_CONTAINERS_INFO'])
		if res:
			for x in res:
				data = {}
				data['container_id'] = x[0]
				data['deposit_volume'] = x[1]
				data['lat'] = x[2]
				data['long'] = x[3]
				data['waste_type'] = x[4]

				ret.append(data)
		else:
			return None

		logger.debug('[CKAN] Containers info sent to portal')
		return ret

	cache.cache_result(60)
	async def get_monthly_waste(self, nMonths):
		logger.debug('[GET_MONTHLY_WASTE] - Funtion called.')
		db_res = await self._execute(QUERIES['GET_MONTH_WASTE'], [nMonths])
		logger.debug('[GET_MONTHLY_WASTE] - Results retrieved from database.')
		ret = []
		if db_res:
			for x in db_res:
				tmp = {}
				tmp['waste'] = x[1]
				tmp['date'] = x[0]
				ret.append(tmp)

			logger.debug('[GET_MONTHLY_WASTE] - Return built.')
			return ret
		else:
			logger.debug('[GET_MONTHLY_WASTE] - Nothing retrieved from database.')
			return None

	async def alter_field_policy(self, id, policy):
		logger.debug('[ALTER_FIELD_POLICY] - Function called.')

		if policy not in ['public', 'restricted', 'internal', 'owner']:
			logger.debug('[ALTER_FIELD_POLICY] - ERROR. An unvalid policy has been atempted to attribute.')
			return -1
		
		await self._execute(QUERIES['ALTER_FIELD_POLICY'], [policy, id])
		logger.debug('[ALTER_FIELD_POLICY] - Field policy updated.')
		return 1

	async def alter_operation(self, id, op):
		logger.debug('[ALTER_OPERATION] - Function called.')

		if op not in ['r', 'w', 'r&w']:
			logger.debug('[ALTER_OPERATION] - ERROR. An unvalid operation has been atempted to attribute.')
			return -1

		await self._execute(QUERIES['ALTER_OP'], [op, id])
		logger.debug('[ALTER_OPERATION] - Function operation updated.')
		return 1

	async def get_policy_table(self, limit=None, offset=None):
		logger.debug('[GET_POLICY_TABLE] - Function called.')
		if limit==None:
			pols = await self._execute(QUERIES['GET_ALL_POLICIES'])
		else:
			pols = await self._execute(QUERIES['GET_ALL_POLICIES_PAG'], [limit, offset])
		logger.debug('[GET_POLICY_TABLE] - Info retrieved from database.')
		count = await self._execute(QUERIES['COUNT_POLICIES'])
		ret = {}
		data = {}
		for i in range(0, len(pols)):
			row = {}
			row['field'] = pols[i][1]
			row['permission'] = pols[i][2]

			data[pols[i][0]] = row

		ret['totalDataSize'] = count[0][0]
		ret['data'] = data

		logger.debug('[GET_POLICY_TABLE] - Return object built.')
		return ret


	async def get_functions_table(self, limit=None, offset=None):
		logger.debug('[GET_FUNCTIONS_TABLE] - Function called.')
		if limit==None:
			pols = await self._execute(QUERIES['GET_ALL_FUNCS'])
		else:
			pols = await self._execute(QUERIES['GET_ALL_FUNCS_PAG'], [limit, offset])
		logger.debug('[GET_FUNCTIONS_TABLE] - Info retrieved from database.')
		print(pols)
		count = await self._execute(QUERIES['COUNT_FUNCS'])
		ret = {}
		data = {}
		for i in range(0, len(pols)):
			row = {}
			row['function'] = pols[i][1]
			perm = await self._execute(QUERIES['GET_RET_POL'], [pols[i][2]])
			if perm:
				row['permission'] = perm[0][0]
			else:
				row['permission'] = ''
			row['operation'] = pols[i][3]

			data[pols[i][0]] = row

		ret['totalDataSize'] = count[0][0]
		ret['data'] = data

		logger.debug('[GET_FUNCTIONS_TABLE] - Return object built.')
		return ret

	async def init_perms(self):
		logger.debug('[INIT_PERMS] - Function called.')
		await self._execute(QUERIES['UPDATE_FIELDS'])
		logger.debug('[INIT_PERMS] - Fields updated.')

		perms = {}
		fields = {}

		fields_tmp = await self._execute(QUERIES['GET_FIELD_POLIC'])
		funcs_tmp = await self._execute(QUERIES['GET_ALL_FUNCS_'])
		logger.debug('[INIT_PERMS] - Info retrieved from database.')

		for x in fields_tmp:
			fields[x[0]] = x[1]

		for z in funcs_tmp:
			if z[1]:
				perms[z[0]] = fields[z[1]]+'-'+z[2]
			else:
				perms[z[0]] = 'public-'+z[2]
		logger.debug('[INIT_PERMS] - Return object built.')

		return perms

	async def init_funcs(self):
		logger.debug('[INIT_FUNCS] - Function called.')

		f = open('/tenant/payt_db/functions', 'r')
		x = f.read().splitlines()
		f.close()
		logger.debug('[INIT_FUNCS] - File read.')

		i = 0
		while i <= len(x)-3:
			func = x[i]
			ret = x[i+1]
			op = x[i+2]
			i = i+3
			await self._execute(QUERIES['INSERT_FUNC'], [func,ret,op])

		logger.debug('[INIT_FUNCS] - Functions added to database.')

	async def get_new_bill_date(self, pid):
		logger.debug('[GET_NEW_BILL_DATE] - Function called.')
		ret = await self._execute(QUERIES['GET_LAST_RBILL_DATE'], [pid])

		last = ret[0][0]

		last_str = (dt.datetime.strptime(last_str, "%d/%m/%Y").date() + relativedelta(days=1)).strftime("%Y-%m-%d")
		logger.debug('[GET_NEW_BILL_DATE] - Return constructed.')
		return last_str

	async def get_count_bills(self, pid):
		logger.debug('[GET_COUNT_BILLS] - Function called.')
		ret = await self._execute(QUERIES['COUNT_BILL_PROD'], [pid])
		logger.debug('[GET_COUNT_BILLS] - Return obtained.')
		return ret[0][0]