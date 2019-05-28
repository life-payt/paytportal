import argparse
import asyncio
import aiohttp_jinja2
import jinja2
import os
import logging

from aiohttp import web
from routes import setup_routes
from yaasc.rabbitmq_ci import YAASCHandler
from manager import Manager
from caching import Cache

MAX_POST_SIZE=50 * 1024**2 # 50 Megabytes

parser = argparse.ArgumentParser(description='life-PAYT Logging Service')
parser.add_argument('--port', default=80, type=int, help='Port of HTTP Server')
parser.add_argument('--rhost', default="127.0.0.1", type=str, help='Host of RabbitMQ Server')
parser.add_argument('--rport', default=1935, type=int, help='Port of RabbitMQ Server')
parser.add_argument('--rusername', default="anonymous", type=str, help='Username for RabbitMQ Server')
parser.add_argument('--rkey', default="anonymous", type=str, help='Key for RabbitMQ Server')
parser.add_argument('--rexchange', default="http-server", type=str, help='Exchange of RabbitMQ Server')
parser.add_argument('--rvhost', default="payt", type=str, help='Vhost of RabbitMQ Server')
parser.add_argument('--mem_host', default="127.0.0.1", type=str, help='Host of Memcached Server')
parser.add_argument('--mem_port', default=11211, type=int, help='Port of Memcached Server')
args = parser.parse_args()

loop = asyncio.get_event_loop()

Cache.get_global()._set_data(
	name='http-server',
	host=args.mem_host,
	port=args.mem_port
)

manager = Manager.get_global(loop,
	key="payt-http-server",
	host=args.rhost,
	port=args.rport,
	username=args.rusername,
	password=args.rkey,
	vhost=args.rvhost,
	exchange=args.rexchange
)

logger = logging.getLogger('http-server')
logger.setLevel(logging.DEBUG)

fh = logging.FileHandler('/tmp/payt.log')
fh.setLevel(logging.DEBUG)

ch = logging.StreamHandler()
ch.setLevel(logging.DEBUG)

yh = YAASCHandler(manager._client)
yh.setLevel(logging.DEBUG)

formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
fh.setFormatter(formatter)
ch.setFormatter(formatter)
yh.setFormatter(formatter)

logger.addHandler(fh)
logger.addHandler(ch)
logger.addHandler(yh)

app = web.Application(loop=loop,client_max_size=MAX_POST_SIZE)
setup_routes(app)
aiohttp_jinja2.setup(app, loader=jinja2.FileSystemLoader('%s/templates/' % os.path.dirname(__file__)))
loop.create_task(manager.start())
web.run_app(app, port=args.port)