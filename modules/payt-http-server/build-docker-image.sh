#!/bin/bash

cd "$(dirname "$0")"

./sync_webapp.sh

docker build -t payt-http-server .
