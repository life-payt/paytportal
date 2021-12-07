import os, argparse
import asyncio
from conf_reader import Configs
from payt_db.caching import Cache
from tenant import Tenant
from file_parsers import p
from data_workers import w
from data_exporters import e

BASE_DIR=os.path.dirname(os.path.abspath(__file__))

parser = argparse.ArgumentParser(description='life-PAYT Tenant')
parser.add_argument('-c', '--cfg-file', help='Set configuration file.')
args = parser.parse_args()

if args.cfg_file:
	CONF_FILE = os.path.join(os.getcwd(), args.cfg_file)
else:
	CONF_FILE = os.path.join(BASE_DIR, 'tenant.cfg')

configs = Configs(CONF_FILE).get()

db = None

async def main_tenant(loop):
	global db
	tenant = Tenant(loop, **configs)
	db = await tenant.start()
	
async def main_worker(loop):
	while db == None:
		await asyncio.sleep(10)

	if 'worker' in configs \
			and 'name' in configs['worker'] \
			and configs['worker']['name'] != 'none':
			worker = w[configs['worker']['name']](**configs['worker'])
			await worker.run(db)

async def main_exporter(loop):
	while db == None:
		await asyncio.sleep(10)

	if 'exporter' in configs \
			and 'e_name' in configs['exporter'] \
			and configs['exporter']['e_name'] != 'none':
			exporter = e[configs['exporter']['e_name']](**configs['exporter'])
			await exporter.run(db)

Cache.get_global()._set_data(
	name=configs['tenant_name'],
	host=configs['memcached']['host'],
	port=configs['memcached']['port']
)

loop = asyncio.get_event_loop()
loop.create_task(main_tenant(loop))
loop.create_task(main_worker(loop))
#loop.create_task(main_exporter(loop))
loop.run_forever()