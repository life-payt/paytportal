import logging
from datetime import datetime
import asyncio
try:
	import ujson as json
except:
	import json

class YAASCHandler(logging.Handler):

	def __init__(self, yaasc_client, exchange='logging'):
		super(YAASCHandler, self).__init__()
		self._client = yaasc_client
		self._exchange = exchange

	def emit(self, record):
		record_d = {
			'asctime': datetime.fromtimestamp(record.created).strftime('%Y-%m-%d %H:%M:%S,%f')[:-3],
			'timestamp': record.created,
			'filename': record.filename,
			'level_name': record.levelname,
			'level_code': record.levelno,
			'module': record.module,
			'msg': record.msg,
			'formated_msg': self.format(record),
			'log_name': record.name,
			'process': record.process,
			'process_name': record.processName,
			'thread': record.thread,
			'thread_name': record.threadName
		}
		asyncio.ensure_future(
			self._client.publish('', record_d, self._exchange),
			loop=self._client._loop
		)