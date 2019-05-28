import argparse
import asyncio
import uuid
from auth import PAYTAuth

parser = argparse.ArgumentParser(description='life-PAYT Auth Module')
parser.add_argument('--secret', default=str(uuid.uuid4()), type=str, help='Secret for token generation')
parser.add_argument('--token_time', default=86400, type=int, help='Token valididy (default is one day)')
parser.add_argument('--host', default="127.0.0.1", type=str, help='Host of RabbitMQ')
parser.add_argument('--port', default=1935, type=int, help='Port of RabbitMQ')
parser.add_argument('--vhost', default="auth", type=str, help='Vhost of RabbitMQ')
parser.add_argument('--exchange', default="auth", type=str, help='Exchange of RabbitMQ')
parser.add_argument('--key', default="lifepayt", type=str, help='Access Key for RabbitMQ')
parser.add_argument('--db_host', default="127.0.0.1", type=str, help='Host of PostgreSQL database')
parser.add_argument('--db_port', default=5432, type=int, help='Port of PostgreSQL database')
parser.add_argument('--db_username', default="postgres", type=str, help='Username for PostgreSQL database')
parser.add_argument('--db_password', default="lifepayt", type=str, help='Password for PostgreSQL database')
parser.add_argument('--db_name', default="payt_auth", type=str, help='Database name in PostgreSQL database')
args = parser.parse_args()

async def main(loop):

	auth = PAYTAuth(loop, 
				key="payt-amqpauth",
				secret=args.secret,
				token_time=args.token_time,
				host=args.host,
				port=args.port,
				username="auth",
				password=args.key,
				vhost=args.vhost,
				exchange=args.exchange,
				exchange_type="fanout",
				db_args= {
					'host': args.db_host,
					'port': args.db_port,
					'username': args.db_username,
					'password': args.db_password,
					'name': args.db_name
				}
	)
	await auth.start()

loop = asyncio.get_event_loop()
loop.create_task(main(loop))
loop.run_forever()