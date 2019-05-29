#!/bin/bash

cd "$(dirname "$0")"

unzip webapp.zip

./sync_webapp.sh

docker build -t payt-http-server .
