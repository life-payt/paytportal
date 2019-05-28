#!/bin/bash

cd "$(dirname "$0")"

AUTH_PLUGIN='amqp'

if [ "$1" == "http" ]; then
    AUTH_PLUGIN='http'
    cp rabbitmq.config.httpauth rabbitmq.config
else
    cp rabbitmq.config.amqpauth rabbitmq.config
fi

CONTAINER_NAME='payt-rabbitmq'
CONTAINER_IMAGE='payt-rabbitmq'

if [[ ! $(docker image ls | grep $CONTAINER_IMAGE) ]]; then
	docker build -t $CONTAINER_IMAGE .
fi

if [[ ! $(docker ps -q -f name=$CONTAINER_NAME) ]]; then
    
    if [[ $(docker ps -aq -f status=exited -f name=$CONTAINER_NAME) ]]; then
        docker rm "$CONTAINER_NAME"
    fi

    docker run -d \
    	--name "$CONTAINER_NAME" \
        -e AUTH_PLUGIN=$AUTH_PLUGIN \
    	-p 5672:5672 \
    	-p 25672:25672 \
    	-p 15672:15672 \
    	-p 61613:61613 \
    	-p 1935:1935 \
    	-p 8080:8080 \
    "$CONTAINER_IMAGE"
fi