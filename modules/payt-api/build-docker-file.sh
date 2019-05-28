#!/bin/sh

if [ "$1" == "production" ] ; then
	unzip server-application/node_modules.zip
fi

docker build -t payt-api .
