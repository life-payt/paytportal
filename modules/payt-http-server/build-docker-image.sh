#!/bin/bash

cd "$(dirname "$0")"

./sync_webapp.sh

mkdir -p temp/yaasc-python
cd temp/yaasc-python
git archive --format=tar --remote=git@git.atnog.av.it.pt:life-payt/yaasc-python.git @ | tar xf -
cd ../..

docker build -t payt-http-server .
rm -r temp
