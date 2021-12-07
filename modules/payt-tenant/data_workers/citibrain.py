import aiohttp
import logging
import asyncio
import time
import datetime as dt
from dateutil.relativedelta import relativedelta

try:
	import ujson as json
except:
	import json

global logger
logger = logging.getLogger('aveiro.citibrain_worker')

class citibrain(object):
	def __init__(self, *args, **kwargs):
		self._address = kwargs.get('address', None)
		self._username = kwargs.get('username', None)
		self._password = kwargs.get('password', None)
		self._token_timeout=int(kwargs.get('token_timeout', 15*60))
		self._refresh_every=int(kwargs.get('sync_period', 86400))
		self._state = kwargs.get('state', None)
		self._token = None
		self._token_validity = 0

	async def run(self, db):
		logger.debug('Starting Citibrain Data worker..')

		if self._state == 'TESTING':
			logger.debug('Running with testing specs..')
		while True:
			await self._sync_containers(db)
			await self._sync_cards(db)
			await self._sync_usages(db)
			logger.info('Data synchronized! Waiting for next Synchronization...')
			now = dt.datetime.now()
			if now.hour > 6 and self._state == 'None':
				nxt = dt.datetime.now()+relativedelta(days=1)
				nxt = dt.datetime(nxt.year, nxt.month, nxt.day, 7, 0, 0)
				time_s = (nxt - dt.datetime.now()).total_seconds()
				logger.info('Setting next Synchronization in %s seconds'%int(time_s))
				await asyncio.sleep(int(time_s))
			else:
				logger.info('Next Synchonization in 24h hours..')
				await asyncio.sleep(self._refresh_every)

	async def _get_token(self):
		async with aiohttp.ClientSession() as session:
			try:
				logger.debug('Getting new token')
				resp = await session.post( \
					"%s/token/"%self._address,
					data=("username=%s&password=%s"%(self._username, self._password)).encode(),
					headers={'content-type': 'application/x-www-form-urlencoded'}
				)
				data = json.loads(await resp.text())
				self._token = data['token']
				self._token_validity = int(time.time()) + self._token_timeout
				return True
			except:
				logger.error('Could not get access token from %s'%self._address)
				return False

	def _token_is_valid(self):
		if not self._token:
			return False
		return int(time.time()) < self._token_validity

	async def _refresh_token(self):
		
		if self._token_is_valid():
			return False

		async with aiohttp.ClientSession() as session:
			try:
				logger.debug('Refreshing token')
				resp = await session.post( \
					"%s/refresh-token/"%self._address,
					data=("token=%s"%self._token).encode(),
					headers={'content-type': 'application/x-www-form-urlencoded'}
				)
				data = json.loads(await resp.text())
				self._token = data['token']
				self._token_validity = int(time.time()) + self._token_timeout
				return True
			except:
				logger.error('Could not refresh token from %s'%self._address)
		return await self._get_token()

	async def _get_data(self, path):
		await self._refresh_token()
		async with aiohttp.ClientSession() as session:
			try:
				resp = await session.get( \
					"%s/%s"%(self._address, path),
					headers={'authorization': 'JWT %s'%self._token}
				)
				return json.loads(await resp.text())
			except:
				logger.error('Could not retrieve data from %s/%s'%(self._address, path))
				return None

	# update containers in database
	async def _sync_containers(self, db):
		data = await self._get_data("api/containers")
		# logs and db stuff
		logger.debug("Containers obtained from Citibrain API. Sending to Database..")
		if data:
			for x in data['results']:
				if x['location'] == None:
					res = await db.insert_container(0, 40, 0.0, 0.0, cb_id=x['id'])
					if res:
						logger.debug("Container inserted without location.")
				else:
					res = await db.insert_container(0, 40, x['location']['coordinates'][1], x['location']['coordinates'][0], cb_id=x['id'])
		logger.debug("Containers updated.")

	# update consumers
	async def _sync_cards(self, db, next=None):
		if next:
			data = await self._get_data("api/consumers/"+next)
		else:
			data = await self._get_data("api/consumers")
		logger.debug("All cards obtained from Citibrain API. Sending to Database..")
		for x in data['results']:
			await db.insert_card(x['card_id'])

		if data['next']:
			await self._sync_cards(db, next=data['next'].split("api/consumers/")[1])
		else:
			logger.debug("Cards updated.")
			return 1

	# get data from last day (date format: YYYY-MM-dd)
	async def _sync_usages(self, db, next=None):
		data = None
		flag = await db.exist_usages()
		last = None

		if flag > 0 or next:
			if next:
				data = await self._get_data("api/usage/"+next)
			else:
				last = await db.get_last_date_coll()
				print(last)
				last = last + relativedelta(days=1)
				print(last)
				data = await self._get_data("api/usage/?start=%s" %(last.strftime('%Y-%m-%d')))
				print(data)

			# insert data
			if data['results']:
				for x in data['results']:
					await db.insert_garbage(x['date'], x['consumer'], x['container'], x['count'])
			logger.debug("Usage data updated.")
		else:
			await self._get_all_usages(db)

		if data:
			if data['next']:
				await self._sync_usages(db, next=data['next'].split("api/usage/")[1])
			else:
				logger.debug("Usages updated.")
				return 1

	# for initial population of database - only applied if db empty
	async def _get_all_usages(self, db):
		data = {}
		if self._state == 'TESTING':
				last = dt.date(2019, 4, 15)
				data = await self._get_data("api/usage/?start=%s" %(last.strftime('%Y-%m-%d')))
		else:
			data = await self._get_data("api/usage")

		if data:
			for x in data['results']:
				await db.insert_garbage(x['date'], x['consumer'], x['container'], x['count'])

			if data['next']:
				await self._sync_usages(db, next=data['next'].split("api/usage/")[1])
