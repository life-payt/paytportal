from yaasc.rabbitmq_ci import YAASClient, YAASCHandler
from itsdangerous import (TimedJSONWebSignatureSerializer as Serializer, BadSignature, SignatureExpired)
import logging
import uuid
import sys
from auth_db.dbfuncs import DBfuncs
from cryptohash import Cryptohash
import asyncio
import base64
import os
import hashlib
import inspect


logger = logging.getLogger('auth')
logger.setLevel(logging.DEBUG)

fh = logging.FileHandler('/tmp/payt.log')
fh.setLevel(logging.DEBUG)

ch = logging.StreamHandler()
ch.setLevel(logging.DEBUG)

formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
fh.setFormatter(formatter)
ch.setFormatter(formatter)

logger.addHandler(fh)
logger.addHandler(ch)

async def db_notification(self, msg):
    pass

class PAYTAuth:
	def __init__(self, loop, **kwargs):
		self._serializer = Serializer(kwargs.get('secret', str(uuid.uuid4())), expires_in=kwargs.get('token_time', 86400))
		self._client = YAASClient(loop, **kwargs)
		self._client.on_connect = self._on_auth_connect
		self._username = kwargs.get('username', 'anonymous')
		self._access_key = kwargs.get('password', 'anonymous')
		self._cryptohash = Cryptohash()
		self._payt_client = YAASClient(loop,
			key="payt-auth",
			host=kwargs.get('host', '127.0.0.1'),
			port=kwargs.get('port', 1935),
			username=self._username,
			password=self._access_key,
			vhost="payt",
			exchange="auth",
			exchange_type="fanout"
		)
		self._payt_client.on_connect = self._on_payt_connect

		self.perms = {}

		db_args = kwargs.get('db_args', None)
		if not db_args:
			self._client._loop.stop()
			sys.exit('No arguments for database access')

		self._db_conn = DBfuncs(
			db_args['host'],
			db_args['port'],
			db_args['name'],
			db_args['username'],
			db_args['password']
		)

	async def start(self):
		attempts = 0
		while True:
			attempts += 1
			try:
				await self._client.connect()
				break
			except Exception as e:
				print(str(e))
				if attempts < 3:
					print("Could not connect to PAYT API. Waiting 60 seconds... ")
					await asyncio.sleep(60)
				else:
					self._client._loop.stop()
					sys.exit("Could not connect to PAYT API. Exiting... ")

		attempts = 0
		while True:
			attempts += 1
			try:
				await self._db_conn.init(db_notification)
				await self._db_conn.init_funcs()
				self.perms = await self._db_conn.init_perms()
				if await self._db_conn.get_userID('lp_admin') == None:
					await self.insert_user('lp_admin', 'admin@email.com', 1, '', passhash = hashlib.sha256('adminpw'.encode()).hexdigest())
					await self.insert_service('payt_tenant', hashlib.sha256('testing_key_tenant'.encode()).hexdigest(), user_id='internal')
					await self.insert_service('logging', hashlib.sha256('testing_key_logging'.encode()).hexdigest(), user_id='internal')
					await self.insert_service('httpserver', hashlib.sha256('testing_key_http'.encode()).hexdigest(), user_id='internal')
				break

			except Exception as e:
				print(str(e))
				if attempts < 3:
					print("Could not connect to database. Waiting 60 seconds... ")
					await asyncio.sleep(60)
				else:
					self._client._loop.stop()
					sys.exit("Could not connect to database. Exiting... ")

	async def _on_auth_connect(self):
		await self._client.register("", self._on_auth_message)
		logger.info("authenticators and authorizers successfully registered")
		await self._payt_client.connect()

	async def _on_payt_connect(self):
		await self._payt_client.register("payt.auth.payt_login", self.payt_login)
		await self._payt_client.register("payt.auth.get_user_info", self.get_user_info)
		await self._payt_client.register("payt.auth.insert_user", self.insert_user)
		await self._payt_client.register("payt.auth.get_email", self.get_email)
		await self._payt_client.register("payt.auth.internal.get_email", self.internal_get_email)
		await self._payt_client.register("payt.auth.update_email", self.update_email)
		await self._payt_client.register("payt.auth.change_pw", self.change_pw)
		await self._payt_client.register("payt.auth.set_role", self.set_role)
		await self._payt_client.register("payt.auth.delete_user", self.delete_user)
		await self._payt_client.register("payt.auth.get_roles", self.get_roles)
		await self._payt_client.register("payt.auth.get_users", self.get_users)
		await self._payt_client.register("payt.auth.get_counties", self.get_counties)
		await self._payt_client.register("payt.auth.get_counties_user", self.get_counties_user)
		await self._payt_client.register("payt.auth.validate_user", self.validate_user)
		await self._payt_client.register("payt.auth.internal.check_user_exists", self._db_conn.user_id_exists)
		await self._payt_client.register("payt.auth.username_exists", self._db_conn.user_exists)
		await self._payt_client.register("payt.auth.get_all_status", self.get_all_status)
		await self._payt_client.register("payt.auth.edit_status", self.edit_status)
		await self._payt_client.register("payt.auth.insert_status", self.insert_status)
		await self._payt_client.register("payt.auth.delete_status", self.delete_status)
		await self._payt_client.register("payt.auth.internal.get_role",self.internal_get_role)
		await self._payt_client.register("payt.auth.get_masterkey", self.get_masterkey)
		await self._payt_client.register("payt.auth.insert_service", self.insert_service)
		await self._payt_client.register("payt.auth.internal.get_user_status", self.get_user_status)
		await self._payt_client.register("payt.auth.internal.get_county_info", self.get_county_info)
		await self._payt_client.register("payt.auth.internal.reset_pw", self.reset_pw)
		await self._payt_client.register("payt.auth.internal.edit_alias", self.edit_alias)
		await self._payt_client.register("payt.auth.internal.get_last_access", self.get_last_access)
		await self._payt_client.register("payt.auth.set_forgotten", self.set_forgotten)
		await self._payt_client.register("payt.auth.internal.ex_client", self.set_status_fclient)
		await self._payt_client.register("payt.auth.get_policies", self.get_policies)
		await self._payt_client.register("payt.auth.get_functions", self.get_functions)
		await self._payt_client.register("payt.auth.alter_policy", self.alter_policy)
		await self._payt_client.register("payt.auth.alter_op", self.alter_op)

		yh = YAASCHandler(self._payt_client)
		yh.setLevel(logging.DEBUG)
		yh.setFormatter(formatter)
		logger.addHandler(yh)
		logger.info("PAYT client and logger successfully registered!")

	async def _on_auth_message(self, message):
		data = message.headers
		action = data.pop('action', None)
		if action == 'login':
			return await self.auth_user(**data)
		elif action == 'check_vhost':
			return await self.auth_vhost(**data)
		elif action == 'check_resource':
			return await self.auth_resource(**data)

		return "deny"

	def is_anonymous(self, user_id, password=None):
		if not password:
			return user_id == 'anonymous'
		return user_id == 'anonymous' and user_id == 'anonymous'

	def is_authenticated(self, user_id, password=None):
		return not self.is_anonymous(user_id, password)

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
			
			role = await self._db_conn.get_role(user_id)

			if p == 'public':
				target = inspect.getargspec(function)[1]
				if target == 'target' and op == 'w':
					return await self.denied()

				logger.debug('![ACCESS CONTROL]! - Access granted.')
				return await function(self, *args, **kwargs)

			if isinstance(user_id, str):
				if user_id == 'anonymous':
					return await self.denied()

			if p == 'restricted':
				if role == 'admin':
					return await function(self, *args, **kwargs)

				target = inspect.getargspec(function)[1]
				if (op == 'r' or op == 'w') and (role == 'user' or role == 'county') and target != 'target':
					logger.debug('![ACCESS CONTROL]! - Access granted.')
					return await function(self, *args, **kwargs)
				
				if op == 'r' and role == 'county' and target == 'target':
					logger.debug('![ACCESS CONTROL]! - Access granted.')
					return await function(self, *args, **kwargs)
				
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

	@access_control
	async def get_user_info(self, **kwargs):
		user_id = kwargs.get('user_id')
		ret = {}
		exists = await self._db_conn.user_id_exists(kwargs.get('user_id'))
		if exists:
			role = await self._db_conn.get_role(kwargs.get('user_id'))
			logger.debug("[GET_USER_INFO][%s][%s] - Function called."%(user_id, role))
			ret['role'] = role
			alias = await self._db_conn.get_alias(user_id)
			ret['alias'] = alias
			email = await self._db_conn.get_email(user_id)
			ret['email'] = email
			logger.debug("[GET_USER_INFO][%s][%s] - Return ready. Sending to front end."%(user_id, role))
			return ret
		else:
			if user_id:
				logger.debug("[GET_USER_INFO][%s][Internal] - Internal call by %s."%(user_id))
				return None
			else:
				logger.debug("[GET_USER_INFO][-][-] - FATAL ERROR. Unauthorized access tried by user_id that does Not Exist.")
				return None


	def check_token(self, user_id, token):
		try:
			data = self._serializer.loads(token.encode())

			if str(data['user_id']) == user_id:
				logger.debug('access token for user %s is valid'%user_id)
				return True
			logger.debug('access token is not valid for user %s'%user_id)
			return False
		except SignatureExpired:
			logger.debug('access token for user %s expired'%user_id)
			return False
		except BadSignature:
			logger.debug('access token for user %s is not valid'%user_id)
			return False

	@access_control
	async def payt_login(self, username, password, **kwargs):
		userexists = await self._db_conn.user_exists(username)
		if userexists:
			user_id = await self._db_conn.get_userID(username)
			# Get status
			role = await self._db_conn.get_role(user_id)
			status = await self._db_conn.check_validated(user_id)
			logger.debug("[PAYT_LOGIN][%s][%s] - User ID and status retrieved."%(user_id, role))

			ban = await self._db_conn.check_banned(user_id)
			if ban[0]:
				logger.debug("[PAYT_LOGIN][][] - ERROR. User %s is banned."%(user_id))
				if ban[1] == -1:
					return {'code': -2, 'time': None, 'user_id': None, 'token': None, 'validated': None}
				
				return {'code': -1, 'time': ban[1], 'user_id': None, 'token': None, 'validated': None}
				
			realpw = await self._db_conn.get_password(user_id)
			salt = await self._db_conn.get_salt(user_id)
			pw_check = await self._cryptohash.comparePW(salt, password, realpw)

			if userexists and pw_check:
				logger.debug("[PAYT_LOGIN][%s][%s] - Login conditions met."%(user_id, role))
				data = {
					'user_id' : user_id
				}
				logger.debug("[PAYT_LOGIN][%s][%s] - Gathering and updating user info.."%(user_id, role))
				
				await self._db_conn.set_last_access(user_id)
				
				info = await self._db_conn.get_string_county(user_id)
				logger.debug("[PAYT_LOGIN][%s][%s] - Returned User ID and access date registered."%(user_id, role))
				return {'code': 1, 'time': None, 'user_id': data['user_id'], 'token': self._serializer.dumps(data).decode(), 'validated': status}
			
			await self._db_conn.fail_login(user_id)
			ban_result = await self._db_conn.set_banned(user_id)
			if ban_result[0]:
				logger.debug("[PAYT_LOGIN][][] - ERROR. User %s has been banned for successive failed logins."%(user_id))
				if ban_result[1] == -1:
					return {'code': -2, 'time': None, 'user_id': None, 'token': None, 'validated': None}
				return {'code': -1, 'time': ban_result[1], 'user_id': None, 'token': None, 'validated': None}
		
		logger.debug("[PAYT_LOGIN][][] - ERROR. Login Conditions Not Met. Login not Done.")
		return {'code': 0, 'time': None, 'user_id': None, 'token': None, 'validated': None}

	async def auth_user(self, username, password, vhost=None):
		user_id = username
		LOG_MSG="[AUTH_USER]: [user_id: %s] -> "%(user_id)

		exists = await self._db_conn.service_exists(user_id)
		pw_match = 0
		if exists:
			pw_hash = hashlib.sha256(password.encode()).hexdigest()
			salt = await self._db_conn.get_service_salt(user_id)
			real_pwhash = await self._db_conn.get_service_pw(user_id)
			pw_match = await self._cryptohash.comparePW(salt, pw_hash, real_pwhash)
		
		conditions = [
			exists and pw_match,
			user_id == self._username and password == self._access_key,
		]

		if self.is_anonymous(user_id, password) \
			or self.check_token(user_id, password) \
			or any(conditions):
			logger.debug("%s AUTHORIZED"%LOG_MSG)
			return ""

		logger.debug("%s REFUSED"%LOG_MSG)
		return "refused"

	async def auth_vhost(self, username, vhost):
		user_id = username
		LOG_MSG="[AUTH_VHOST]: [user_id: %s, vhost: %s] -> "%(user_id, vhost)

		exists = await self._db_conn.service_exists(user_id)
		allow_conditions = [
			vhost == 'payt' and not self.is_anonymous(user_id),
			vhost == 'payt' and exists,
			vhost == 'payt' and self.is_anonymous(user_id)
		]

		if any(allow_conditions):
			logger.debug("%s AUTHORIZED"%LOG_MSG)
			return "allow"

		logger.debug("%s REFUSED"%LOG_MSG)
		return "deny"

	async def auth_resource(self, username, vhost, resource, name, permission):
		user_id = username
		LOG_MSG="[AUTH_RESOURCE]: [user_id: %s, vhost: %s, resource: %s, name: %s, permission: %s] -> "\
			%(user_id,vhost, resource, name, permission)

		logger.debug("%s AUTHORIZED"%LOG_MSG)
		return "allow"
	
	# role esta assumido como numero.. 1: admin 2: county 3: user
	# geracao de passwd automatica
	async def insert_service(self, name, passhash, **kwargs):
		user_id = kwargs.get('user_id')
		'''if user_id > 1 or user_id == 'internal':
			logger.debug('[INSERT_SERVICE]: UNAUTHORIZED ACCESS MADE! USER ID: %s'%(user_id))
			return None'''
		logger.debug('[INSERT_SERVICE][%s][admin] - Access authorized.'%(user_id))
		
		exists = await self._db_conn.service_exists(name)
		if exists:
			logger.debug('[INSERT_SERVICE][%s][admin] - ERROR: Service already exists!')
			return None

		salt, finalpasshash = await self._cryptohash.doHash(passhash)
		logger.debug('[INSERT_SERVICE][%s][admin] - Salt and service key calculated.'%(user_id))

		sid = await self._db_conn.insert_service(name, salt, finalpasshash)
		if sid:
			logger.debug('[INSERT_SERVICE][%s][admin] - Service %s added to database.'%(user_id, name))
			return sid
	
		logger.debug('[INSERT_SERVICE][%s][admin] - ERROR: Service %s not added to database.'%(user_id, name))
		return None

	@access_control
	async def insert_user(self, username, email, role, county, passhash=None, alias=None, **kwargs):
		user_id = kwargs.get('user_id')
		uidrole = await self._db_conn.get_role(user_id) if type(user_id) is not str else None
		logger.debug("[INSERT_USER][%s][%s] - Function Called."%(user_id, uidrole))

		if await self._db_conn.user_exists(username):
			in_user = await self._db_conn.get_userID(username)
			logger.debug("[INSERT_USER][%s][%s] - User %s Already Exists."%(user_id, uidrole, in_user))
			return in_user

		# generate masterkey
		masterkey = str(uuid.uuid4())[:16]
		# generate pw and salt to store
		# if admin, insert original password
		if username == 'lp_admin':
			salt, finalpasshash = await self._cryptohash.doHash(passhash)
		else:
			salt, finalpasshash = await self._cryptohash.doHash(hashlib.sha256(masterkey.encode()).hexdigest())
		
		if alias == None:
			alias = username
		master_hashed = await self._cryptohash.doHashSalt(masterkey, salt)
		result = await self._db_conn.insert_user(username, email, alias, role, salt, finalpasshash, county, master_hashed)
		
		if result:
			in_user = await self._db_conn.get_userID(username)
			logger.debug("[INSERT_USER][%s][%s] - User %s Added To Database."%(user_id, uidrole, in_user))
			user_id = await self._db_conn.get_userID(username)
			return user_id
		else:
			logger.debug("[INSERT_USER][%s][%s] - User Not Added To Database."%(user_id, uidrole))
			return None
	
	@access_control
	async def update_email(self, email, **kwargs):
		user_id = kwargs.get('user_id')
		role = await self._db_conn.get_role(user_id)
		logger.debug("[UPDATE_EMAIL][%s][%s] - Function Called."%(user_id, role))

		ret = await self._db_conn.set_email(email, user_id)
		if not ret:
			logger.debug("[UPDATE_EMAIL][%s][%s] - Email Updated."%(user_id, role))
			return 0
		else:
			logger.debug("[UPDATE_EMAIL][%s][%s] - Error: Email Not Updated."%(user_id, role))
			return 1

	# 0: success
	# 1: general error
	# 2: old pwd incorrect
	# 3: old pwd == new pwd
	@access_control
	async def change_pw(self, oldpwd, newpwd, **kwargs):
		user_id = kwargs.get('user_id')
		role = await self._db_conn.get_role(user_id)
		logger.debug("[CHANGE_PW][%s][%s] - Function Called."%(user_id, role))

		if oldpwd == newpwd:
			logger.debug("[CHANGE_PW][%s][%s] - Failed: New Password Is Equal To Old."%(user_id, role))
			return 3

		real = await self._db_conn.get_password(kwargs.get('user_id'))
		salt = await self._db_conn.get_salt(kwargs.get('user_id'))
		check = await self._cryptohash.comparePW(salt, oldpwd, real)

		if check:
			newsalt, newpwdhash = await self._cryptohash.doHash(newpwd)
			update = await self._db_conn.set_pw(newsalt, newpwdhash, kwargs.get('user_id'))
			if update:
				logger.debug("[CHANGE_PW][%s][%s] - Success: New Password Is Set."%(user_id, role))
				return 0

			logger.debug("[CHANGE_PW][%s][%s] - Failed: Database Error."%(user_id, role))
			return 1
		else:
			logger.debug("[CHANGE_PW][%s][%s] - Failed: Old Password Incorrect."%(user_id, role))
			return 2

	# done only by system admins
	@access_control
	async def set_role(self, target, role, **kwargs):
		user_id = kwargs.get('user_id')
		uid_role = await self._db_conn.get_role(user_id)
		logger.debug("[SET_ROLE][%s][%s] - Function Called."%(user_id, uid_role))

		res = await self._db_conn.set_role(target, role)
		rolestr = await self._db_conn.get_role(target)
		if res:
			logger.debug("[SET_ROLE][%s][%s] - User %s Role Set To %s."%(user_id, uid_role, target, rolestr))
			return 1
		else:
			logger.debug("[SET ROLE][%s][%s] - Failed."%(user_id, uid_role))
			return 0

	@access_control
	async def delete_user(self, target, **kwargs):
		if target == 1:
			logger.debug("[DELETE_USER][%s][%s] - Critical! User %s Tried To Delete Super Admin."%(user_id, role, target))
			return 0

		user_id = kwargs.get('user_id')
		role = await self._db_conn.get_role(user_id)
		logger.debug("[DELETE_USER][%s][%s] - Function Called."%(user_id, role))

		res = await self._db_conn.delete_user(target)
		if res:
			logger.debug("[DELETE_USER][%s][%s] - User %s Deleted From Database."%(user_id, role, target))
			return 1
		else:
			logger.debug("[DELETE_USER][%s][%s] - User %s Not Deleted From Database."%(user_id, role, target))
			return 0
	
	@access_control
	async def get_roles(self, **kwargs):
		user_id = kwargs.get('user_id')
		role = await self._db_conn.get_role(user_id)
		logger.debug("[GET_ROLES][%s][%s] - Function Called."%(user_id, role))

		ret = await self._db_conn.get_all_roles()
		if ret:
			logger.debug("[GET_ROLES][%s][%s] - All Roles Sent To Front End."%(user_id, role))
		else:
			logger.debug("[GET_ROLES][%s][%s] - No Roles Sent To Front End."%(user_id, role))
		return ret

	@access_control
	async def get_users(self, page, nelements, search, **kwargs):
		user_id = kwargs.get('user_id')
		role = await self._db_conn.get_role(user_id)
		logger.debug("[GET_USERS][%s][%s] - Function Called."%(user_id, role))
		
		if search == '':
			ret = await self._db_conn.get_all_users(limit=nelements, offset=(page-1)*nelements)
		else:
			ret = await self._db_conn.get_search_users(search, limit=nelements, offset=(page-1)*nelements)

		if ret:
			logger.debug("[GET_USERS][%s][%s] - All Users Sent To Front End."%(user_id, role))
		else:
			logger.debug("[GET_USERS][%s][%s] - No Users Sent To Front End."%(user_id, role))

		return ret

	@access_control
	async def get_counties(self, **kwargs):
		user_id = kwargs.get('user_id')
		role = await self._db_conn.get_role(user_id)
		logger.debug("[GET_COUNTIES][%s][%s] - Function Called."%(user_id, role))
		
		ret = await self._db_conn.get_all_counties()
		if ret:
			logger.debug("[GET_COUNTIES][%s][%s] - All Counties Sent To Front End."%(user_id, role))
		else:
			logger.debug("[GET_COUNTIES][%s][%s] - No Counties Sent To Front End."%(user_id, role))
		return ret

	@access_control
	async def get_email(self, **kwargs):
		user_id = kwargs.get('user_id')
		logger.debug("[GET_EMAIL][%s][-] - Function Called."%(user_id))
		
		ret = await self._db_conn.get_email(user_id)
		logger.debug("[GET_EMAIL][%s][] - Email Sent To Front End."%(user_id))
		return ret

	async def internal_get_email(self, userid, **kwargs):
		ret = await self._db_conn.internal_get_email(userid)
		return ret

	@access_control
	async def get_counties_user(self, **kwargs):
		user_id = kwargs.get('user_id')
		role = await self._db_conn.get_role(user_id)
		logger.debug("[GET_COUNTIES_USER][%s][-] - Function Called."%(user_id))		
		
		ret = await self._db_conn.get_user_counties(user_id)

		if ret:
			logger.debug("[GET_COUNTIES_USER][%s][%s] - All Counties Relative Sent To Front End."%(user_id, role))
		else:
			logger.debug("[GET_COUNTIES_USER][%s][%s] - No Counties Found For User."%(user_id, role))

		return ret

	@access_control
	async def validate_user(self, real_user_id, email, pwd, **kwargs):
		role = await self._db_conn.get_role(real_user_id)
		logger.debug("[VALIDATE_USER][%s][%s] - Function Called."%(real_user_id, role))
		em = await self._db_conn.set_email(email, real_user_id)
		logger.debug("[VALIDATE_USER][%s][%s] - Set_email Called."%(real_user_id, role))

		old = await self._db_conn.get_password(real_user_id)
		logger.debug('[VALIDATE_USER][%s][%s] - Old Pwd Retrieved.'%(real_user_id, role))
		
		new_salt, new_pwd = await self._cryptohash.doHash(pwd)
		pwd = await self._db_conn.set_pw(new_salt, new_pwd, real_user_id)
		logger.debug('[VALIDATE_USER][%s][%s] - Password Change Executed.'%(real_user_id, role))

		if pwd and not em:
			logger.debug('[VALIDATE_USER][%s][%s] - Email And Password Updated Successfully.'%(real_user_id, role))
			# call alter validated field
			await self._db_conn.set_validated(real_user_id)
			logger.debug('[VALIDATE_USER][%s][%s] - User Account Validated.'%(real_user_id, role))
			return 0
		else:
			logger.debug('[VALIDATE_USER][%s][%s] - ERROR. Email Or Password Update Failed. User Not Validated.'%(real_user_id, role))
			return pwd

	async def get_all_status(self, **kwargs):
		user_id = kwargs.get('user_id')
		role = ''
		if user_id:
			role = await self._db_conn.get_role(user_id)

		# temporary! will be replaced
		if role == 'admin':
			logger.debug('[GET_ALL_STATUS][%s][%s] - Access authorized.'%(user_id, role))
			ret = await self._db_conn.get_all_status()
			logger.debug('[GET_ALL_STATUS][%s][%s] - Result from Database retrieved.'%(user_id, role))
			return ret
		else:
			logger.debug('[GET_ALL_STATUS][%s][%s] - WARNING! UNAUTHORIZED ACCESS TO FUNCTION HAS BEEN ATTEMPTED!'%(user_id,role))
			return None

	async def internal_get_role(self, userid, **kwargs):
		role = await self._db_conn.get_role(userid)
		return role

	async def get_settable_status(self, **kwargs):
		user_id = kwargs.get('user_id')
		role = ''
		if user_id:
			role = await self._db_conn.get_role(user_id)

		# temporary! will be replaced
		if role == 'admin' or role == 'county':
			logger.debug('[GET_SETTABLE_STATUS][%s][%s] - Access authorized.'%(user_id, role))
			all_st = await self._db_conn.get_all_status()
			logger.debug('[GET_SETTABLE_STATUS][%s][%s] - Result from Database retrieved.'%(user_id, role))
			ret = {x: all_st[x] for x in all_st if x not in [0,1]}
			return ret
		else:
			logger.debug('[GET_SETTABLE_STATUS][%s][%s] - WARNING! UNAUTHORIZED ACCESS TO FUNCTION HAS BEEN ATTEMPTED!'%(user_id,role))
			return None

	@access_control
	async def edit_status(self, status_id, new_status, **kwargs):
		user_id = kwargs.get('user_id')
		role = ''
		if user_id:
			role = await self._db_conn.get_role(user_id)

		# temporary! will be replaced
		if role == 'admin':
			logger.debug('[GET_ALL_STATUS][%s][%s] - Access authorized.'%(user_id, role))
			ret = await self._db_conn.edit_status(status_id, new_status)
			logger.debug('[GET_ALL_STATUS][%s][%s] - Status %d has been updated.'%(user_id, role, status_id))
			return ret
		else:
			logger.debug('[GET_ALL_STATUS][%s][%s] - WARNING! UNAUTHORIZED ACCESS TO FUNCTION HAS BEEN ATTEMPTED!'%(user_id,role))
			return None

	@access_control
	async def insert_status(self, status_id, status, **kwargs):
		user_id = kwargs.get('user_id')
		role = ''
		if user_id:
			role = await self._db_conn.get_role(user_id)

		# temporary! will be replaced
		if role == 'admin':
			logger.debug('[INSERT_STATUS][%s][%s] - Access authorized.'%(user_id, role))
			ret = await self._db_conn.insert_status(status_id, status)
			logger.debug('[INSERT_STATUS][%s][%s] - Status %d has been inserted.'%(user_id, role, status_id))
			return ret
		else:
			logger.debug('[INSERT_STATUS][%s][%s] - WARNING! UNAUTHORIZED ACCESS TO FUNCTION HAS BEEN ATTEMPTED!'%(user_id,role))
			return None

	@access_control
	async def delete_status(self, status_id, **kwargs):
		user_id = kwargs.get('user_id')
		role = ''
		if user_id:
			role = await self._db_conn.get_role(user_id)

		if status_id <= 1:
			logger.debug('[DELETE_STATUS][%s][%s] - WARNING! UNAUTHORIZED ACTION HAS BEEN ATTEMPTED! DELETE OF STATUS NOT AUTHORIZED.'%(user_id,role))
			return None
			
		# temporary! will be replaced/improved
		if role == 'admin':
			logger.debug('[DELETE_STATUS][%s][%s] - Access authorized.'%(user_id, role))
			ret = await self._db_conn.delete_status(status_id)
			logger.debug('[DELETE_STATUS][%s][%s] - Status %d has been inserted.'%(user_id, role, status_id))
			return ret
		else:
			logger.debug('[DELETE_STATUS][%s][%s] - WARNING! UNAUTHORIZED ACCESS TO FUNCTION HAS BEEN ATTEMPTED!'%(user_id,role))
			return None

	@access_control
	async def get_masterkey(self, user, **kwargs):
		user_id = kwargs.get('user_id')
		role = ''
		role = await self._db_conn.get_role(user_id)

		if role == 'county' or role == 'admin':
			logger.debug('[GET_MASTERKEY][%s][%s] - Access authorized.'%(user_id, role))
			ret = await self._db_conn.get_masterkey(user)
			logger.debug('[GET_MASTERKEY][%s][%s] - Masterkey of %s obtained.'%(user_id, role, user))
			return ret
		else:
			logger.debug('[GET_MASTERKEY][%s][%s] - WARNING! UNAUTHORIZED ACCESS TO FUNCTION HAS BEEN ATTEMPTED!'%(user_id,role))
			return None

	async def get_user_status(self, userid, **kwargs):
		ret = await self._db_conn.get_status_user(userid)
		return ret

	async def get_county_info(self, **kwargs):
		logger.debug('[GET_COUNTY_INFO][][] - Called.')
		user_id = kwargs.get('user_id')

		county = await self._db_conn.get_string_county(user_id)

		ret = {}
		ret['county'] = county

		logger.debug('[GET_COUNTY_INFO][][] - Return obtained.')
		return ret

	@access_control
	async def reset_pw(self, username, mk_hash, **kwargs):
		exists = await self._db_conn.user_exists(username)
		if exists:
			p_userid = await self._db_conn.get_userID(username)
			master = await self._db_conn.get_masterkey(p_userid)

			if mk_hash == hashlib.sha256(master.encode()).hexdigest():
				logger.debug('[RESET_PW][][] - Username exists and Masterkey matches. Resetting now..')
				
				newsalt, newpwdhash = await self._cryptohash.doHash(mk_hash)
				update = await self._db_conn.set_pw(newsalt, newpwdhash, p_userid)

				if update:
					logger.debug("[RESET_PW][][] - Success: New Password Is Set.")
					return 0
				logger.debug('[RESET_PW][][] - Password reset to Masterkey.')
				return 1

			logger.debug('[RESET_PW][][] - ERROR. Provided masterkey doesnt match.')
			return 0
		else:
			logger.debug('[RESET_PW][][] - ERROR. Username does not exist. Password not reset.')
			return 0

	@access_control
	async def edit_alias(self, new_alias, **kwargs):
		logger.debug('[EDIT_ALIAS][][] - Function called.')
		user_id = kwargs.get('user_id')
		exists = await self._db_conn.user_id_exists(user_id)

		if exists:
			res = await self._db_conn.edit_alias(new_alias, user_id)
			logger.debug('[EDIT_ALIAS][][] - Alias edited.')
			return 0
		
		logger.debug('[EDIT_ALIAS][][] - ERROR! User ID does not exist..')
		return 1

	async def get_last_access(self, userid, **kwargs):
		la = await self._db_conn.get_last_access(userid)
		return str(la)

	async def set_forgotten(self, **kwargs):
		user_id = kwargs.get('user_id')
		role = self._db_conn.get_role(user_id)
		logger.debug('[SET_FORGOTTEN][%s][%s] - Function called.'%(user_id, role))
		logger.debug('[SET_FORGOTTEN][%s][%s] - User claimed right to be forgotten.'%(user_id, role))
		await self._db_conn.set_forgotten(user_id)

		return 1

	async def set_status_fclient(self, uid, **kwargs):
		logger.debug('[SET_STATUS_CLIENT][INTERNAL] - Function called.')
		await self._db_conn.set_status_fclient(uid)
		logger.debug('[SET_STATUS_CLIENT][INTERNAL] - Status changed for user %s.'%(uid))

	@access_control
	async def get_policies(self, page, nelements, search, **kwargs):
		user_id = kwargs.get('user_id')
		role = await self._db_conn.get_role(user_id)
		logger.debug("[GET_POLICIES][%s][%s] - Function Called."%(user_id, role))
		
		if search == '' or search.lower() == 'auth':
			ret = await self._db_conn.get_policy_table(limit=nelements, offset=(page-1)*nelements)
		else:
			serv = await self._db_conn.get_services_name()
			services_name = [i.split('payt_', 1)[1] for i in serv if 'payt_' in i]
			if search.lower() in services_name:
				ret = await self._payt_client.call('payt.'+search.lower()+'.db.internal.get_policies',page,nelements,exchange=search.lower())
			else:
				ret = await self._db_conn.get_policy_table(search, limit=nelements, offset=(page-1)*nelements)
		
		if ret:
			logger.debug("[GET_POLICIES][%s][%s] - All policies Sent To Front End."%(user_id, role))
		else:
			logger.debug("[GET_POLICIES][%s][%s] - No policies Sent To Front End."%(user_id, role))

		return ret

	@access_control
	async def get_functions(self, page, nelements, search, **kwargs):
		user_id = kwargs.get('user_id')
		role = await self._db_conn.get_role(user_id)
		logger.debug("[GET_FUNCTIONS][%s][%s] - Function Called."%(user_id, role))
		
		if search == '' or search.lower() == 'auth':
			ret = await self._db_conn.get_functions_table(limit=nelements, offset=(page-1)*nelements)
		else:
			serv = await self._db_conn.get_services_name()
			services_name = [i.split('payt_', 1)[1] for i in serv if 'payt_' in i]
			if search.lower() in services_name:
				ret = await self._payt_client.call('payt.'+search.lower()+'.db.internal.get_functions', page, nelements, exchange=search.lower())
			else:
				ret = await self._db_conn.get_functions_table(limit=nelements, offset=(page-1)*nelements)
		
		if ret:
			logger.debug("[GET_FUNCTIONS][%s][%s] - All policies Sent To Front End."%(user_id, role))
		else:
			logger.debug("[GET_FUNCTIONS][%s][%s] - No policies Sent To Front End."%(user_id, role))

		return ret

	@access_control
	async def alter_policy(self, id, policy, search, **kwargs):
		logger.debug('[ALTER_POLICY] - Function called')

		if search == '' or search.lower() == 'auth':
			await self._db_conn.alter_field_policy(id, policy)
			self.perms = await self._db_conn.init_perms()
		else:
			serv = await self._db_conn.get_services_name()
			services_name = [i.split('payt_', 1)[1] for i in serv if 'payt_' in i]
			if search.lower() in services_name:
				ret = await self._payt_client.call('payt.'+search.lower()+'.db.internal.alter_policy', id, policy, exchange=search.lower())

		logger.debug('[ALTER_POLICY] - Database updated.')
		return 1

	@access_control
	async def alter_op(self, id, op, search, **kwargs):
		logger.debug('[ALTER_OP] - Function called')

		if search == '' or search.lower() == 'auth':
			await self._db_conn.alter_operation(id, op)
			self.perms = await self._db_conn.init_perms()
		else:
			serv = await self._db_conn.get_services_name()
			services_name = [i.split('payt_', 1)[1] for i in serv if 'payt_' in i]
			if search.lower() in services_name:
				ret = await self._payt_client.call('payt.'+search.lower()+'.db.internal.alter_op', id, op, exchange=search.lower())

		logger.debug('[ALTER_OP] - Database updated.')
		return 1