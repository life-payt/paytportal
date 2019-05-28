
class YAASCInt(object):
	def __init__(self, loop, **kwargs):
		raise NotImplementedError("Method not implemented by backend")

	async def connect(self, *args, **kwargs):
		raise NotImplementedError("Method not implemented by backend")

	async def disconnect(self, *args, **kwargs):
		raise NotImplementedError("Method not implemented by backend")

	async def publish(self, topic, payload, exchange=None):
		raise NotImplementedError("Method not implemented by backend")

	async def subscribe(self, topic, exchange=None):
		raise NotImplementedError("Method not implemented by backend")

	async def unsubscribe(self, topic, exchange=None):
		raise NotImplementedError("Method not implemented by backend")

	async def register(self, topic):
		raise NotImplementedError("Method not implemented by backend")

	async def unregister(self, topic):
		raise NotImplementedError("Method not implemented by backend")

	async def call(self, topic, *args, **kwargs):
		raise NotImplementedError("Method not implemented by backend")