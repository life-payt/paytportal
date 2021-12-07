#!/bin/sh

if [ ! -f /tenant.cfg ]; then
	echo "[TENANT INFO]
		TENANT_NAME = $TENANT_NAME

		[RABBITMQ]
		RABBITMQ_HOST = $RABBITMQ_HOST
		RABBITMQ_PORT = $RABBITMQ_PORT
		RABBITMQ_VHOST = $RABBITMQ_VHOST
		RABBITMQ_USER = $RABBITMQ_USER
		RABBITMQ_KEY = $RABBITMQ_KEY

		[DATABASE]
		DB_HOST = $DB_HOST
		DB_PORT = $DB_PORT
		DB_USERNAME = $DB_USERNAME
		DB_PASSWORD = $DB_PASSWORD
		DB_DBNAME = $DB_DBNAME

		[MEMCACHED]
		MEM_HOST = $MEMCACHED_HOST
		MEM_PORT = $MEMCACHED_PORT 

		[PARSERS]
		USERS = $PARSER_USERS
		BILLS = $PARSER_BILLS

		[WORKER]
		NAME = "$W_NAME"
		ADDRESS = "$W_ADDRESS"
		USERNAME = "$W_USERNAME"
		PASSWORD = "$W_PASSWORD"
		SYNC_PERIOD = "$W_SYNC_PERIOD"
		TOKEN_TIMEOUT = "$W_TOKEN_TIMEOUT"
		STATE = "$W_STATE"

		[EXPORTER]
		E_NAME = "$E_NAME"
		URL_CKAN = "$E_URL_CKAN"
		API_KEY = "$E_API_KEY"
		E_COUNTY = "$E_COUNTY"

		" \
		| sed -e 's/^[ \t]*//' | sed -e 's/\t/ /g' \
		> /tenant.cfg
fi
python -u /tenant -c /tenant.cfg
