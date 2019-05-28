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
logger = logging.getLogger('aveiro.worker')

class citibrain(object):
	def __init__(self, *args, **kwargs):
		self._address = kwargs.get('address', None)
		self._username = kwargs.get('username', None)
		self._password = kwargs.get('password', None)
		self._token_timeout=int(kwargs.get('token_timeout', 15*60))
		self._refresh_every=int(kwargs.get('sync_period', 86400))
		self._token = None
		self._token_validity = 0

	async def run(self, db):
		logger.debug('Starting API Data worker..')
		while True:
			# do stuff with the API you are accessing every x seconds (x = self._refresh_every)
			logger.info('Data synchronized! Waiting %s seconds until next Synchronization.'%(self._refresh_every))
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

    # The Path variable indicates the path to the resource provided by the API defined in self._address
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

