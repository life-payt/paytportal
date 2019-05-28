#!/bin/bash

cd "$(dirname "$0")"

if [ "$1" == "http" ]; then
    cp rabbitmq.config.httpauth rabbitmq.config
else
    cp rabbitmq.config.amqpauth rabbitmq.config
fi

docker build -t payt-rabbitmq .
