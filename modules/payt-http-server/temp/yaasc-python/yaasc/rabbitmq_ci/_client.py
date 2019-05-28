from .._interface import YAASCInt

import aio_pika
import uuid
import inspect
from asyncio import Future
try:
	import ujson as json
except:
	import json

EXCHANGE_TYPE = {
	"topic" : aio_pika.ExchangeType.TOPIC,
	"direct": aio_pika.ExchangeType.DIRECT,
	"headers": aio_pika.ExchangeType.HEADERS,
	"fanout": aio_pika.ExchangeType.FANOUT
}

class DummyObject:
	def __init__(self, **kwargs):
		self.__dict__.update(kwargs)

class YAASClient(YAASCInt):

	def __init__(self, loop, **kwargs):
		self._loop = loop
		self._key = kwargs.get('key', str(uuid.uuid4()))
		self._host = kwargs.get('host', 'localhost')
		self._port = kwargs.get('port', 5672)
		self._username = kwargs.get('username', 'guest')
		self._password = kwargs.get('password', 'guest')
		self._exchange_name = kwargs.get('exchange', 'yaasc')
		self._exchange_type = EXCHANGE_TYPE.get(kwargs.get('exchange_type', 'direct'), EXCHANGE_TYPE['direct'])
		self._vhost = kwargs.get('vhost', '/')
		self._connection = None
		self._channel = None
		self._exchange = None
		self._exclusive_queue = None
		self._worker_queue = None
		self._callbacks = dict()
		self._resp_callbacks = dict()
		self.on_message = None
		self.on_connect = None

	async def connect(self):
		self._connection = await aio_pika.connect_robust("amqp://%s:%s@%s:%d/%s"%(
				self._username,
				self._password,
				self._host,
				self._port,
				self._vhost if self._vhost != '/' else ''
			), loop=self._loop)
		
		self._channel = await self._connection.channel()
		
		self._exchange = await self._channel.declare_exchange(self._exchange_name, self._exchange_type)

		self._exclusive_queue = await self._channel.declare_queue(exclusive=True, auto_delete=True)
		self._worker_queue = await self._channel.declare_queue(self._key, auto_delete=True)
		await self._channel.set_qos(prefetch_count=7)
		await self._exclusive_queue.consume(self._on_response)
		await self._worker_queue.consume(self._on_response)
		if self.on_connect:
			await self.on_connect()

	async def _on_response(self, message: aio_pika.IncomingMessage):
		with message.process():
			if message.reply_to and message.correlation_id:
				if message.routing_key in self._callbacks:
					try:
						args = json.loads(message.body.decode())
						kwargs = dict()
						if message.user_id:
							kwargs['user_id'] = message.user_id
						try:
							response = await self._callbacks[message.routing_key](*args, **kwargs)
						except:
							response = await self._callbacks[message.routing_key](*args)

						if type(response) == list or type(response) == tuple:
							response = json.dumps([ response ])
						else:
							response = json.dumps(response)
					except:
						response = await self._callbacks[message.routing_key](message)
					await self._channel.default_exchange.publish(
						aio_pika.Message(
							body=response.encode(),
							correlation_id=message.correlation_id,
							user_id=self._username
						),
						routing_key=message.reply_to
					)

			elif message.correlation_id.decode() != 'None' \
				and message.correlation_id.decode() != '':
				if message.correlation_id in self._resp_callbacks:
					func = self._resp_callbacks.pop(message.correlation_id)
					result = json.loads(message.body.decode())
					if type(result) == list or type(result) == tuple:
						result = result[0]
					if type(func) == Future:
						func.set_result(result)
					else:
						await func(result)
			else:
				if self.on_message:
					if inspect.iscoroutinefunction(self.on_message):
						await self.on_message(json.loads(message.body.decode()), message.routing_key, message.exchange)
					else:
						self.on_message(json.loads(message.body.decode()), message.routing_key, message.exchange)

	async def disconnect(self):
		return await self._connection.close()

	async def subscribe(self, topic, exchange=None):
		_exchange = DummyObject(name=exchange) if exchange else self._exchange
		return await self._worker_queue.bind(_exchange,routing_key=topic)

	async def unsubscribe(self, topic, exchange=None):
		_exchange = DummyObject(name=exchange) if exchange else self._exchange
		return await self._worker_queue.unbind(_exchange,routing_key=topic)

	async def publish(self, topic, payload, exchange=None):
		_exchange = exchange if exchange else self._exchange.name
		# message = aio_pika.Message(payload.encode(),content_type='text/plain',user_id=self._username)
		message = aio_pika.Message(json.dumps(payload).encode(),content_type='text/plain',user_id=self._username)
		return await self._channel._publish(
			_exchange,
			topic,
			message.body,
			properties=message.properties,
			mandatory=True,
			immediate=False
		)

	async def register(self, topic, method):
		if topic not in self._callbacks:
			self._callbacks[topic] = method
			return await self.subscribe(topic)

	async def unregister(self, topic):
		if topic in self._callbacks:
			del self._callbacks[topic]
			return await self.unsubscribe(topic, exchange)

	async def call(self, topic, *args, **kwargs):
		_exchange = kwargs.get('exchange', self._exchange.name)
		correlation_id = str(uuid.uuid4()).encode()
		
		_callback = kwargs.get('callback', None)
		if _callback:
			self._resp_callbacks[correlation_id] = _callback
		else:
			future = self._loop.create_future()
			self._resp_callbacks[correlation_id] = future
		message = aio_pika.Message(
			json.dumps(args).encode(),
			content_type='text/plain',
			correlation_id=correlation_id,
			reply_to=self._exclusive_queue.name,
			user_id=self._username
		)
		await self._channel._publish(
			_exchange,
			topic,
			message.body,
			properties=message.properties,
			mandatory=True,
			immediate=False
		)
		if _callback:
			return None
		return await future

