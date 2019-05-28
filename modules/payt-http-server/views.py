import aiohttp_jinja2
import uuid
import os
import logging
from caching import Cache
from manager import Manager
from aiohttp import web

if not os.path.exists('/tmp/payt/'):
	try:
		os.makedirs('/tmp/payt/')
	except OSError as exc:
		if exc.errno != errno.EEXIST:
			raise

logger = logging.getLogger('http-server.views')
cache = None
manager = None

@aiohttp_jinja2.template('index.html')
async def index(request):
	return {}

async def upload(request):
	global cache
	if not cache:
		cache = await Cache.get_global().init()
	resource = await cache.get(request.match_info['resource'])
	if resource:
		reader = await request.multipart()
		token = await (await reader.next()).text()
		
		if token == resource['token']:
			f = await reader.next()
			filename = f.filename
			filepath = os.path.join('/tmp/payt/', request.match_info['resource'])

			size = 0
			with open(filepath, 'wb') as fout:
				while True:
					chunk = await f.read_chunk()
					if not chunk:
						break
					size += len(chunk)
					fout.write(chunk)

			global manager
			if not manager:
				manager = Manager.get_global()
			await manager.process_resource(request.match_info['resource'], filename, filepath)

			return web.Response(text='success')

		return web.HTTPForbidden()

	return web.HTTPNotFound()