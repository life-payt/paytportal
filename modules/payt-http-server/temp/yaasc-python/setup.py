from setuptools import setup

requires = [
	'aio_pika==4.0.0',
	'asyncio',
]

setup(
	name="YAASC",
	version="0.1",
	packages=["yaasc", "yaasc.rabbitmq_ci"],
	install_requires=requires
)
