import asyncio
import aiopg
import datetime as dt
from dateutil.relativedelta import relativedelta
from collections import OrderedDict
from .queries import QUERIES, APPEND_END_DATE
import inspect
import logging
import os
from .caching import Cache

logger = logging.getLogger('auth.dbfuncs')

class DBfuncs(object):
	def __init__(self, host, port, dbname, user, password):
		self._dsn = 'dbname=%s user=%s password=%s host=%s port=%d'%\
					(dbname, user, password, host, port)
		self._pool = None
		self._listener = None
		self._list_conn = None

	async def init(self, notify_callback):
		self._notify_callback = notify_callback
		self._pool = await aiopg.create_pool(self._dsn)
		self._list_conn = await self._pool.acquire()
		self._listener = asyncio.ensure_future(self.start_notification_listener())

	async def start_notification_listener(self):
		while True:
			msg = await self._list_conn.notifies.get()
			await self._notify_callback(msg)
			logger.debug('Notification from DB: %s'%str(msg))

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
				await cur.execute(query, parameters)
				try:
					ret = []
					async for row in cur:
						ret.append(row)
					return ret
				except:
					return None

	#
	# query functions
	#

	# if user exists -> returns 1
	# if not -> returns 0
	async def user_id_exists(self, user_id):
		logger.debug('[USER_ID_EXISTS] - Function called.')
		exists = await self._execute(QUERIES['CHECK_USER_ID'], [user_id])
		logger.debug('[USER_ID_EXISTS] - Return obtained from Database.')
		return exists[0][0]

	# if user exists -> returns 1
	# if not -> returns 0
	async def user_exists(self, username):
		logger.debug('[USER_EXISTS] - Function called.')
		exists = await self._execute(QUERIES['CHECK_USER'], [username])
		logger.debug('[USER_EXISTS] - Return obtained from Database.')
		return exists[0][0]

	# given an username
	# returns its password+hash
	# please verify existance with user_exists!
	async def get_password(self, user_id):
		logger.debug('[GET_PASSWORD] - Function called.')
		ret = await self._execute(QUERIES['GET_PASSWORD'], [user_id])
		logger.debug('[GET_PASSWORD] - Return obtained from Database.')
		return ret[0][0] if ret else 0

	async def get_role(self, user_id):
		logger.debug('[GET_ROLE] - Function called.')
		ret = await self._execute(QUERIES['GET_ROLE'], [user_id])
		logger.debug('[GET_ROLE] - Return obtained from Database.')
		return ret[0][0] if ret else None

	async def get_userID(self, username):
		logger.debug('[GET_USERID] - Function called.')
		ret = await self._execute(QUERIES['GET_USER_ID'], [username])
		logger.debug('[GET_USERID] - Return obtained from Database.')
		return ret[0][0] if ret else None

	async def get_email(self, user_id):
		logger.debug('[GET_EMAIL] - Function called.')
		ret = await self._execute(QUERIES['GET_EMAIL'], [user_id])
		logger.debug('[GET_EMAIL] - Return obtained from Database.')
		return ret[0][0] if ret else ''

	async def internal_get_email(self, user_id):
		ret = await self._execute(QUERIES['GET_EMAIL'], [user_id])
		return ret[0][0] if ret else ''

	# it is important to define if it is a customer or staff
	# please always input the role of the user in the system
	async def insert_user(self, username, email, alias, role, salt, passhash, county, masterkey):
		logger.debug('[INSERT_USER] - Function called.')
		if type(county) == str:
			county = [await self.get_county_id(county)]

		if role == 3:
			await self._execute(QUERIES['INSERT_USER'], [username, email, alias, role, salt, passhash, masterkey])
			if type(county) == list:
				for i in county:
					await self._execute(QUERIES['INSERT_CUST'], [username, i])
			logger.debug('[INSERT_USER] - User(user) inserted to database.')
			return 1
		elif role == 2:
			await self._execute(QUERIES['INSERT_USER'], [username, email, alias, role, salt, passhash, masterkey])
			if county != []:
				for i in county:
					await self._execute(QUERIES['INSERT_CTY'], [username, i])
			logger.debug('[INSERT_USER] - User(county) inserted to database.')
			return 1
		else:
			await self._execute(QUERIES['INSERT_USER'], [username, email, alias, role, salt, passhash, masterkey])
			logger.debug('[INSERT_USER] - User(admin) inserted to database.')
			return 1
		# 0 -> user was not inserted!
		logger.debug('[INSERT_USER] - No user inserted to database.')
		return 0

	# valid input must be the correct username
	# everything else must be handled by the caller (ask for pw etc.)
	async def delete_user(self, user_id):
		logger.debug('[DELETE_USER] - Function called.')
		# check if user is in db
		exists = await self.user_id_exists(user_id)
		if exists:
			await self._execute(QUERIES['DELETE_USR'], [user_id])
			logger.debug('[DELETE_USER] - Deleted.')
			return 1
		logger.debug('[DELETE_USER] - User not deleted -> was not in database.')
		return 0

	async def set_email(self, email, user_id):
		logger.debug('[SET_EMAIL] - Function called.')
		exists = await self.user_id_exists(user_id)
		if exists:
			await self._execute(QUERIES['SET_EMAIL'], [email, user_id])
			logger.debug('[SET_EMAIL] - Email updated in database.')
			return 0
		logger.debug('[SET_EMAIL] - Email not updated in database.')
		return 1

	async def get_all_roles(self):
		logger.debug('[GET_ALL_ROLES] - Function called.')
		roles = await self._execute(QUERIES['GET_ALL_ROLES'])
		logger.debug('[GET_ALL_ROLES] - Info retrieved from database.')
		ret = {}
		for i in range(0, len(roles)):
			role = {}
			role['role'] = roles[i][1]
			count = await self._execute(QUERIES['COUNT_ROLE'], [roles[i][0]])
			role['count'] = count[0][0]
			ret[roles[i][0]] = role

		logger.debug('[GET_ALL_ROLES] - Return object built.')
		return ret

	async def set_role(self, user_id, role):
		logger.debug('[SET_ROLE] - Function called.')
		exists = await self.user_id_exists(user_id)
		if exists:
			await self._execute(QUERIES['SET_ROLE'], [role, user_id])
			logger.debug('[SET_ROLE] - Role updated.')
			return 1
		else:
			logger.debug('[SET_ROLE] - Role not updated.')
			return 0

	async def set_pw(self, salt, phash, user_id):
		logger.debug('[SET_PW] - Function called.')
		exists = await self.user_id_exists(user_id)
		if exists:
			await self._execute(QUERIES['SET_PW'], [salt, phash, user_id])
			logger.debug('[SET_PW] - Password updated.')
			return 1
		else:
			logger.debug('[SET_PW] - Password not updated.')
			return 0

		# TODO: get all roles and number of them

	async def get_all_counties(self):
		logger.debug('[GET_ALL_COUNTIES] - Function called.')
		counties = await self._execute(QUERIES['GET_ALL_COUNTIES'])
		logger.debug('[GET_ALL_COUNTIES] - Info retrieved from database.')
		ret = {}
		for i in range(0, len(counties)):
			ret[counties[i][0]] = counties[i][1]

		logger.debug('[GET_ALL_COUNTIES] - Return object built.')
		return ret

	async def get_all_users(self, limit=None, offset=None):
		logger.debug('[GET_ALL_USERS] - Function called.')
		if limit==None:
			users = await self._execute(QUERIES['GET_ALL_USERS'])
		else:
			users = await self._execute(QUERIES['GET_ALL_USERS_PAG'], [limit, offset])
		logger.debug('[GET_ALL_USERS] - Info retrieved from database.')
		count = await self._execute(QUERIES['COUNT_USERS'])
		ret = {}
		data = {}
		for i in range(0, len(users)):
			user = {}
			user['username'] = users[i][1]
			user['email'] = users[i][2]
			user['role'] = users[i][3]
			counties = await self.get_user_counties(users[i][0])
			user['counties'] = counties
			user['status'] = users[i][4]
			if users[i][5] == None:
				user['last_access'] = 'N/D'
			else:
				user['last_access'] = users[i][5].strftime('%d-%m-%Y')
			data[users[i][0]] = user

		ret['totalDataSize'] = count[0][0]
		ret['data'] = data

		logger.debug('[GET_ALL_USERS] - Return object built.')
		return ret

	async def get_search_users(self, search, limit=None, offset=None):
		logger.debug('[GET_SEARCH_USERS] - Function called.')
		if limit==None:
			users = await self._execute(QUERIES['GET_SEARCH_USERS'], ['%'+search+'%', '%'+search+'%'])
		else:
			users = await self._execute(QUERIES['GET_SEARCH_USERS_PAG'], ['%'+search+'%', '%'+search+'%', limit, offset])
		logger.debug('[GET_SEARCH_USERS] - Info retrieved from database.')
		count = await self._execute(QUERIES['COUNT_SEARCH'], ['%'+search+'%', '%'+search+'%'])
		ret = {}
		data = {}
		for i in range(0, len(users)):
			user = {}
			user['username'] = users[i][1]
			user['email'] = users[i][2]
			user['role'] = users[i][3]
			counties = await self.get_user_counties(users[i][0])
			user['counties'] = counties
			user['status'] = users[i][4]
			if users[i][5] == None:
				user['last_access'] = 'N/D'
			else:
				user['last_access'] = users[i][5].strftime('%d-%m-%Y')
			data[users[i][0]] = user

		ret['totalDataSize'] = count[0][0]
		ret['data'] = data

		logger.debug('[GET_SEARCH_USERS] - Return object built.')
		return ret

	async def get_user_counties(self, user_id):
		logger.debug('[GET_USER_COUNTIES] - Function called.')
		role = await self.get_role(user_id)
		ret =[]

		if role == 'user':
			logger.debug('[GET_USER_COUNTIES] - User has role \'user\'.')
			username = await self.get_username(user_id)
			counties = await self._execute(QUERIES['GET_USER_COUNTIES'], [username])
			for i in range (0, len(counties)):
				ret.append(counties[i][0])
			logger.debug('[GET_USER_COUNTIES] - Info retrieved from database.')

		elif role == 'county':
			logger.debug('[GET_USER_COUNTIES] - User has role \'county\'.')
			username = await self.get_username(user_id)
			counties = await self._execute(QUERIES['GET_ADMIN_COUNTIES'], [username])
			for i in range (0, len(counties)):
				ret.append(counties[i][0])
			logger.debug('[GET_USER_COUNTIES] - Info retrieved from database.')

		else:
			logger.debug('[GET_USER_COUNTIES] - User has no county associated.')
			ret = ''

		return ret

	async def get_salt(self, user_id):
		logger.debug('[GET_SALT] - Function called.')
		ret = await self._execute(QUERIES['GET_SALT'], [user_id])
		if ret:
			logger.debug('[GET_SALT] - Info retrieved from database.')
			return ret[0][0]
		else:
			logger.debug('[GET_SALT] - No info in database. No return..')
			return 0

	async def get_username(self, user_id):
		logger.debug('[GET_USERNAME] - Function called.')
		ret = await self._execute(QUERIES['GET_USERNAME'], [user_id])
		if ret:
			logger.debug('[GET_USERNAME] - Info retrieved from database.')
			return ret[0][0]
		else:
			logger.debug('[GET_USERNAME] - No info in database. No return..')
			return 0

	async def get_county_id(self, name):
		logger.debug('[GET_COUNTY_ID] - Function called.')
		ret = await self._execute(QUERIES['GET_COUNTY_ID'], [name])
		logger.debug('[GET_COUNTY_ID] - Info retrieved from database.')
		return ret[0][0] if ret else None

	async def get_string_county(self, user_id):
		logger.debug('[GET_STRING_COUNTY] - Function called.')
		username = await self.get_username(user_id)
		role = await self.get_role(user_id)
		if role == 'user':
			ret = await self._execute(QUERIES['GET_COUNTY'], [username])
			logger.debug('[GET_STRING_COUNTY] - Info retrieved from database.')
			return {'role': role, 'county': ret[0][0]}
		else:
			logger.debug('[GET_STRING_COUNTY] - Info retrieved from database.')
			ret = await self._execute(QUERIES['GET_COUNTY_STAFF'], [username])
		return ret[0][0] if ret else ''

	async def get_alias(self, user_id):
		logger.debug('[GET_ALIAS] - Function called.')
		ret = await self._execute(QUERIES['GET_ALIAS'], [user_id])
		logger.debug('[GET_STRING_COUNTY] - Info retrieved from database.')
		return ret[0][0] if ret else None

	async def edit_alias(self, alias, user_id):
		logger.debug('[EDIT_ALIAS] - Function called.')
		print(QUERIES['EDIT_ALIAS'], [alias, user_id])
		ret = await self._execute(QUERIES['EDIT_ALIAS'], [alias, user_id])
		logger.debug('[EDIT_ALIAS] - Info updated in database.')
		return ret[0][0] if ret else None

	async def check_validated(self, user_id):
		logger.debug('[CHECK_VALIDATED] - Function called.')
		ret = await self._execute(QUERIES['GET_VALIDATED'], [user_id])
		logger.debug('[CHECK_VALIDATED] - Info retrieved from database.')
		return ret[0][0] if ret else None

	async def set_validated(self, user_id):
		logger.debug('[SET_VALIDATED] - Function called.')
		await self._execute(QUERIES['SET_VALIDATED'], [user_id])
		logger.debug('[SET_VALIDATED] - Info updated in database.')
		return 1

	async def get_all_status(self):
		logger.debug('[GET_ALL_STATUS] - Function called.')
		ret = await self._execute(QUERIES['GET_ALL_STATUS'])
		logger.debug('[GET_ALL_STATUS] - Info retrieved from database.')

		ret = {}
		for i in range(0, len(res)):
			ret[res[i][0]] = res[i][1]

		return ret

	async def edit_status(self, st_id, status):
		logger.debug('[EDIT_STATUS] - Function called.')
		ret = await self._execute(QUERIES['EDIT_STATUS'], [st_id, status])
		logger.debug('[EDIT_STATUS] - Info updated in database.')
		return ret

	async def insert_status(self, st_id, status):
		logger.debug('[INSERT_STATUS] - Function called.')
		ret = await self._execute(QUERIES['INSERT_STATUS'], [st_id, status])
		logger.debug('[INSERT_STATUS] - Info added to database.')
		return ret

	async def delete_status(self, st_id):
		logger.debug('[DELETE_STATUS] - Function called.')
		ret = await self._execute(QUERIES['DELETE_STATUS'], [st_id])
		logger.debug('[DELETE_STATUS] - Info removed from database.')
		return ret

	async def get_masterkey(self, user):
		logger.debug('[GET_MASTERKEY] - Function called.')
		ret = await self._execute(QUERIES['GET_MASTER'], [user])
		logger.debug('[GET_MASTERKEY] - Info retrieved from database.')
		return ret[0][0]

	async def set_masterkey(self, user, masterhashed):
		logger.debug('[SET_MASTERKEY] - Function called.')
		ret = await self._execute(QUERIES['SET_MASTER'], [masterhashed, user])
		logger.debug('[SET_MASTERKEY] - Info updated in database.')
		return ret

	async def service_exists(self, service):
		logger.debug('[SERVICE_EXISTS] - Function called.')
		ret = await self._execute(QUERIES['GET_SERVICE'], [service])
		logger.debug('[SERVICE_EXISTS] - Info retrieved from database.')
		return ret[0][0]

	async def get_services_name(self):
		logger.debug('[GET_SERVICES_NAME] - Function called.')
		temp = await self._execute(QUERIES['GET_SERVICES_NAME'])
		logger.debug('[GET_SERVICES_NAME] - Info retrived from database.')
		ret = []
		for x in temp:
			ret.append(x[0])
		return ret

	async def get_service_salt(self, idservice):
		logger.debug('[GET_SERVICE_SALT] - Function called.')
		ret = await self._execute(QUERIES['GET_SALT_SERVICE'], [idservice])
		logger.debug('[GET_SERVICE_SALT] - Info retrieved from database.')
		return ret[0][0]

	async def get_service_pw(self, idservice):
		logger.debug('[GET_SERVICE_PW] - Function called.')
		ret = await self._execute(QUERIES['GET_SALT_PW'], [idservice])
		logger.debug('[GET_SERVICE_PW] - Info retrieved from database.')
		return ret[0][0]

	async def insert_service(self, name, salt, pwhash):
		logger.debug('[INSERT_SERVICE] - Function called.')
		ret = await self._execute(QUERIES['INSERT_SERVICE'], [name, salt, pwhash])
		logger.debug('[INSERT_SERVICE] - Info added to database.')
		if ret:
			logger.debug('[INSERT_SERVICE] - Success.')
			return 1
		else:
			logger.debug('[INSERT_SERVICE] - No success.')
			return None

	async def get_status_user(self, userid):
		ret = await self._execute(QUERIES['GET_STATUS_USER'], [userid])
		if ret:
			return ret[0][0]
		else:
			return None

	async def set_last_access(self, user_id):
		logger.debug('[SET_LAST_ACCESS] - Function called.')
		await self._execute(QUERIES['SET_LAST_ACCESS'], [user_id])
		logger.debug('[SET_LAST_ACCESS] - Info updated in database.')

	async def get_last_access(self, user_id):
		logger.debug('[GET_LAST_ACCESS] - Function called.')
		ret = await self._execute(QUERIES['GET_LAST_ACCESS'], [user_id])
		logger.debug('[GET_LAST_ACCESS] - Info retrieved from database.')
		if ret[0][0]:
			return ret[0][0].strftime('%d-%m-%Y')
		else:
			return 'N/D'

	async def set_forgotten(self, user_id):
		logger.debug('[SET_FORGOTTEN] - Function called.')
		await self._execute(QUERIES['SET_FORGOTTEN'], [user_id])
		logger.debug('[SET_FORGOTTEN] - Right To Be Forgotten For User %s Set.'%(user_id))

	async def set_status_fclient(self, user_id):
		logger.debug('[SET_STATUS_FCLIENT] - Function called.')
		await self._execute(QUERIES['SET_STATUS_FCLIENT'], [user_id])
		logger.debug('[SET_STATUS_FCLIENT] - Status as Former client for User %s Set.'%(user_id))

	async def check_banned(self, user_id):
		dt_now = dt.datetime.now()
		logger.debug('[CHECK_BANNED] - Function called.')
		ret = await self._execute(QUERIES['CHECK_BANNED'], [user_id])
		logger.debug('[CHECK_BANNED] - Info retrieved from database.')
		if ret[0][0]:
			expire_ban = await self._execute(QUERIES['GET_TIME_EXP'], [user_id])
			if expire_ban[0][0] == '-1':
				logger.debug('[CHECK_BANNED] - User %s permanentely banned.'%(user_id))
				return 1, -1
			expire_ban_dt = dt.datetime.strptime(expire_ban[0][0], "%d-%m-%Y %H:%M")
			if dt_now > expire_ban_dt:
				logger.debug('[CHECK_BANNED] - Ban period for %s expired.'%(user_id))
				await self._execute(QUERIES['DELETE_BAN_ENTRY'], [user_id])
				logger.debug('[CHECK_BANNED] - User %s removed from ban list.'%(user_id))
				return 0, 0
			else:
				logger.debug('[CHECK_BANNED] - User %s is banned.'%(user_id))
				minutes = (expire_ban_dt - dt_now).seconds / 60
				return 1, str(round(minutes, 1))
		else:
			logger.debug('[CHECK_BANNED] - User %s not banned.'%(user_id))
			return 0, 0
		
		logger.debug('[CHECK_BANNED] - Something went wrong. Exiting function...')
		return 0, 0

	async def fail_login(self, user_id):
		logger.debug('[LOG_FAILED_LOGIN] - Function called.')
		await self._execute(QUERIES['LOG_FAIL'], [user_id])
		logger.debug('[LOG_FAILED_LOGIN] - Failed login attempt for user %s logged.'%(user_id))
		return 1

	async def set_banned(self, user_id):
		logger.debug('[SET_BANNED] - Function called.')
		failed_logins = await self._execute(QUERIES['COUNT_FAILED_LOGINS'], [user_id])
		if failed_logins[0][0] >= 5 and failed_logins[0][0] < 7:
			time = 5
			expire_dt = (dt.datetime.now() + relativedelta(minutes=time)).strftime("%d-%m-%Y %H:%M")
			await self._execute(QUERIES['SET_BAN'], [user_id, expire_dt])
			logger.debug('[SET_BANNED] - Ban time for %s set.'%(user_id))
			return 1, 5

		if failed_logins[0][0] >= 7 and failed_logins[0][0] < 12:
			time = 10
			expire_dt = (dt.datetime.now() + relativedelta(minutes=time)).strftime("%d-%m-%Y %H:%M")
			await self._execute(QUERIES['SET_BAN'], [user_id, expire_dt])
			logger.debug('[SET_BANNED] - Ban time for %s set.'%(user_id))
			return 1, 10

		if failed_logins[0][0] >= 12 and failed_logins[0][0] < 15:
			time = 15
			expire_dt = (dt.datetime.now() + relativedelta(minutes=time)).strftime("%d-%m-%Y %H:%M")
			await self._execute(QUERIES['SET_BAN'], [user_id, expire_dt])
			logger.debug('[SET_BANNED] - Ban time for %s set.'%(user_id))
			return 1, 15

		if failed_logins[0][0] > 17:
			time = '-1'
			await self._execute(QUERIES['SET_BAN'], [user_id, time])
			logger.debug('[SET_BANNED] - Ban time for %s set.'%(user_id))
			return 1, -1
			
		logger.debug('[SET_BANNED] - User %s not banned yet'%(user_id))
		return 0, 0

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
			print(x)
			if x[1] == None:
				fields[x[0]] = 'public'
			else:
				fields[x[0]] = x[1]

		for z in funcs_tmp:
			if z[1]:
				if z[2]:
					perms[z[0]] = fields[str(z[1])]+'-'+str(z[2])
				else:
					perms[z[0]] = fields[z[1]]+'-'+'w'
			else:
				perms[z[0]] = 'public-'+z[2]
		logger.debug('[INIT_PERMS] - Return object built.')

		return perms

	async def init_funcs(self):
		logger.debug('[INIT_FUNCS] - Function called.')

		f = open('/auth/auth_db/functions', 'r')
		x = f.read().splitlines()
		f.close()
		logger.debug('[INIT_FUNCS] - File read.')
		ind = -2
		i = 0
		while i <= len(x)-3:
			func = x[i]
			ret = x[i+1]
			op = x[i+2]
			i = i+3

			await self._execute(QUERIES['INSERT_FUNC'], [func,ret,op])

		logger.debug('[INIT_FUNCS] - Functions added to database.')

	async def get_api_users(self, limit=None, offset=None):
		logger.debug('[GET_API_USERS] - Function called.')

		raw_data = await self._execute(QUERIES['GET_API_USERS'], [limit, offset])
		logger.debug('[GET_API_USERS] - Info retrieved from database.')

		count = await self._execute(QUERIES['GET_COUNT_APIU'])
		ret = {}
		data = {}
		for i in range(0, len(raw_data)):
			user = {}
			user['email'] = raw_data[i][1]
			user['username'] = raw_data[i][2]
			user['county'] = raw_data[i][3]
			user['ext_uid'] = raw_data[i][4]
			print(user)
			data[raw_data[i][0]] = user

		ret['totalDataSize'] = count[0][0]
		ret['data'] = data

		logger.debug('[GET_API_USERS] - Return object built.')
		return ret

	async def insert_api_user(self, username, email, county, ext_uid):
		logger.debug('[INSERT_API_USER] - Function called.')

		print(username)
		print(email)
		print(county)
		await self._execute(QUERIES['INSERT_API_USERS'], [email, username, county, ext_uid])

		logger.debug('[INSERT_API_USER] - Info added to database.')

		return 1