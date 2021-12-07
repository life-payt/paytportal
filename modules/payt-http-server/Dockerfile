FROM python:3-alpine
MAINTAINER Helder Moreira

ENV HTTP_PORT 8000
ENV RABBITMQ_HOST 127.0.0.1
ENV RABBITMQ_PORT 1935
ENV RABBITMQ_VHOST payt
ENV RABBITMQ_EXCHANGE http-server
ENV RABBITMQ_USER anonymous
ENV RABBITMQ_KEY anonymous
ENV MEMCACHED_HOST 127.0.0.1
ENV MEMCACHED_PORT 11211

COPY temp/yaasc-python /yaasc

RUN    apk --update upgrade \
    && apk add gcc g++ musl-dev \
    && pip install --no-cache-dir -U pip

ADD . /httpserver

RUN pip install -r /httpserver/requirements.txt
RUN cd /yaasc && python setup.py install

CMD python -u /httpserver \
    --port "$HTTP_PORT" \
    --rhost "$RABBITMQ_HOST" \
    --rport "$RABBITMQ_PORT" \
    --rusername "$RABBITMQ_USER" \
    --rkey "$RABBITMQ_KEY" \
    --rvhost "$RABBITMQ_VHOST" \
    --rexchange "$RABBITMQ_EXCHANGE" \
    --mem_host "$MEMCACHED_HOST" \
    --mem_port "$MEMCACHED_PORT"