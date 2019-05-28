FROM python:3-alpine
MAINTAINER Helder Moreira

ENV TENANT_NAME tenant_name
ENV RABBITMQ_HOST 127.0.0.1
ENV RABBITMQ_PORT 1935
ENV RABBITMQ_VHOST payt
ENV RABBITMQ_USER anonymous
ENV RABBITMQ_KEY anonymous
ENV DB_HOST 127.0.0.1
ENV DB_PORT 5432
ENV DB_USERNAME postgres
ENV DB_PASSWORD postgres_test_pw
ENV DB_DBNAME db_name
ENV PARSER_USERS csv_001
ENV PARSER_BILLS ss_001
ENV MEMCACHED_HOST 127.0.0.1
ENV MEMCACHED_PORT 11211
ENV W_NAME none
ENV W_ADDRESS none
ENV W_USERNAME none
ENV W_PASSWORD none
ENV W_SYNC_PERIOD 300
ENV W_TOKEN_TIMEOUT 900
ENV E_NAME none
ENV E_URL_CKAN none
ENV E_API_KEY none
ENV E_COUNTY none

COPY temp/yaasc-python /yaasc

RUN    apk --update upgrade \
	&& apk add postgresql-dev \
	&& apk add --virtual build-base \
    && pip install --no-cache-dir -U pip

ADD . /tenant
RUN rm /tenant/tenant.cfg

RUN pip install -r /tenant/requirements.txt
RUN cd /yaasc && python setup.py install


CMD /tenant/start.sh

