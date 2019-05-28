#!/bin/bash

rabbitmq-plugins enable --offline rabbitmq_management
rabbitmq-plugins enable --offline rabbitmq_auth_backend_cache
rabbitmq-plugins enable --offline rabbitmq_topic_authorization

if [ "$AUTH_PLUGIN" == "amqp" ]; then
	rabbitmq-plugins enable --offline rabbitmq_auth_backend_amqp
elif [ "$AUTH_PLUGIN" == "http" ]; then
	rabbitmq-plugins enable --offline rabbitmq_auth_backend_http
fi

rabbitmq-plugins enable --offline rabbitmq_stomp
rabbitmq-plugins enable --offline rabbitmq_web_stomp


if [ "$AUTH_PLUGIN" == "amqp" ]; then
	( sleep 5 ; \
	cp /var/lib/rabbitmq/mnesia/rabbit@*-plugins-expand/rabbitmq_management-3.6.12/priv/www/cli/rabbitmqadmin /usr/local/bin/ ; \
	chmod +x /usr/local/bin/rabbitmqadmin ; \
	rabbitmqctl add_vhost auth 2>/dev/null ; \
	rabbitmqctl add_vhost payt 2>/dev/null ; \
	rabbitmqctl add_user auth $AUTH_ACCESS_KEY 2>/dev/null ; \
	rabbitmqctl set_permissions -p payt auth  ".*" ".*" ".*" ; \
	rabbitmqctl set_permissions -p auth auth  ".*" ".*" ".*" ; \
	rabbitmqctl set_permissions -p payt guest  ".*" ".*" ".*") &
	timeout 20s rabbitmq-server $@

elif [ "$AUTH_PLUGIN" == "http" ]; then
	( sleep 5 ; \
	cp /var/lib/rabbitmq/mnesia/rabbit@*-plugins-expand/rabbitmq_management-3.6.12/priv/www/cli/rabbitmqadmin /usr/local/bin/ ; \
	chmod +x /usr/local/bin/rabbitmqadmin ; \
	rabbitmqctl add_vhost payt 2>/dev/null ; \
	rabbitmqctl set_permissions -p payt guest  ".*" ".*" ".*") &
fi

(sleep 10; \
rabbitmqadmin -V payt declare exchange name=logging type=fanout durable=false; \
rabbitmqadmin -V payt declare exchange name=notify type=topic durable=false) &
rabbitmq-server $@


