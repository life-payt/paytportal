import asyncio
import aiomcache
import inspect
import time
import logging
try:
	import ujson as json
except:
	import json

def setup_logger(name):
	global logger
	logger = logging.getLogger('%s.caching'%name)

class Cache:

	_instance = None

	@staticmethod
	def get_global(*args, **kwargs):
		if Cache._instance is None:
			Cache._instance = Cache(*args, **kwargs)
		return Cache._instance

	def __init__(self, *args, **kwargs):
		self._memcached = False
		self._init = False
		self._host = kwargs.get('host', 'localhost')
		self._port = kwargs.get('port', 11211)
		self._loop = kwargs.get('loop', asyncio.get_event_loop())
	
	def _set_data(self, **kwargs):
		self._host = kwargs.get('host', 'localhost')
		self._port = kwargs.get('port', 11211)
		self._loop = kwargs.get('loop', asyncio.get_event_loop())
		setup_logger(kwargs.get('name', 'CACHE'))

	async def init(self, **kwargs):
		if self._init: return self
		try:
			self._cache = aiomcache.Client(self._host, self._port, loop=self._loop)
			await self._cache.set("deleteme".encode(), "deleteme".encode(), 1)
			self._memcached = True
			logger.debug('Using memcached')
		except:
			self._cache = dict()
			logger.debug('Using memory cache')
		self._init = True
		return self

	async def set(self, key, value, expirity=0):
		if not self._init: raise Exception('Cache not initialized')

		if self._memcached:
			return await self._cache.set(key.encode(), json.dumps(value).encode(), expirity)

		self._cache[key] = (value, (int(time.time()) + expirity if expirity > 0 else None))
		return True

	async def get(self, key):
		if not self._init: raise Exception('Cache not initialized')

		if self._memcached:
			data = await self._cache.get(key.encode())
			if not data:
				return None
			return json.loads(data)

		if key in self._cache:
			value, validity = self._cache[key]
			valid = (validity - time.time()) >= 0
			if valid:
				return value
		return None

	async def delete(self, key):
		if not self._init: raise Exception('Cache not initialized')

		if self._memcached:
			return await self._cache.delete(key.encode())

		del self._cache[key]
		return True

	def cache_result(self, time=60):
		def decorator(fn):
			async def wrapper(*args,**kwargs):
				if 'self' in list(inspect.signature(fn).parameters):
					key_args = [str(x) for x in args[1:]]
				else:
					key_args = [str(x) for x in args]
				key = ':'.join([fn.__name__]+key_args)

				value = await self.get(key)
				if value:
					return value

				value = await fn(*args,**kwargs)
				try:
					await self.set(key, value, time)
				except:
					pass
				return value
			return wrapper
		return decorator