import uuid
import logging
import base64
import os
import sys
import asyncio
from yaasc.rabbitmq_ci import YAASClient
from caching import Cache

logger = logging.getLogger('http-server.manager')

class Manager:
	_instance = None
	@staticmethod
	def get_global(*args, **kwargs):
		if Manager._instance is None:
			Manager._instance = Manager(*args, **kwargs)
		return Manager._instance
		
	def __init__(self, *args, **kwargs):
		self._client = YAASClient(*args,**kwargs)
		self._client.on_connect = self._on_client_connect

	async def start(self):
		attempts = 0
		while True:
			attempts += 1
			try:
				await self._client.connect()
				break
			except Exception as e:
				if attempts < 3:
					print("Could not connect to PAYT API. Waiting 60 seconds... ")
					await asyncio.sleep(60)
				else:
					self._client._loop.stop()
					sys.exit("Could not connect to PAYT API. Exiting... ")

	async def _on_client_connect(self):
		logger.info("PAYT client successfully connected")
		global cache
		cache = await Cache.get_global().init()
		await self._client.register('payt.http-server.create_resource', self.create_resource)

	async def create_resource(self, reply_to):
		resource = str(uuid.uuid4())
		token = str(uuid.uuid4()) #### TESTING ONLY?
		await cache.set(resource, {'reply_to': reply_to, 'token': token}, 600)
		logger.info("Created resource with ID: %s for sending to '%s'"%(resource, reply_to))
		return resource, token

	async def process_resource(self, resource_id, filename, filepath):
		resource = await cache.get(resource_id)
		logger.info("Processing resource with ID: %s for sending to '%s'"%(resource_id, resource['reply_to']))

		with open(filepath, 'rb') as f:
			content = base64.b64encode(f.read())
			d = {'name': filename, 'content': content.decode('utf-8'), 'resource': resource_id}
			await self._client.publish(resource['reply_to'][0], d, resource['reply_to'][1])
			await cache.delete(resource_id)
			os.remove('/tmp/payt/'+resource_id)
			logger.debug('Resource processed.')
			return True

		logger.debug('Resource not processed.')

		return False