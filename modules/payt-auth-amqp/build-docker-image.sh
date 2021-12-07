#!/bin/bash

cd "$(dirname "$0")"

#mkdir -p temp/yaasc-python
#cd temp/yaasc-python
#git archive --format=tar --remote=git@git.atnog.av.it.pt:life-payt/yaasc-python.git @ | tar -xf -
#cd ../..

docker build -t payt-auth-amqp .
#rm -r temp
