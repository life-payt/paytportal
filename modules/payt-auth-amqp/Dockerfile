FROM python:3-alpine3.9
MAINTAINER Helder Moreira

ENV RABBITMQ_HOST 127.0.0.1
ENV RABBITMQ_PORT 1935
ENV RABBITMQ_VHOST auth
ENV RABBITMQ_EXCHANGE auth
ENV AUTH_ACCESS_KEY lifepayt
ENV DB_HOST 127.0.0.1
ENV DB_PORT 5432
ENV DB_USERNAME postgres
ENV DB_PASSWORD lifepayt
ENV DB_DBNAME payt_auth
ENV SECRET lifepayt
ENV TOKEN_TIME 86400

COPY temp/yaasc-python /yaasc

RUN    apk --update upgrade \
	&& apk add gcc postgresql-dev \
	&& apk add --virtual build-base \
    && pip install --no-cache-dir -U pip

ADD . /auth

RUN pip install -r /auth/requirements.txt
RUN cd /yaasc && python setup.py install

CMD python -u /auth \
	--secret "$SECRET" \
	--token_time "$TOKEN_TIME" \
	--host "$RABBITMQ_HOST" \
	--port "$RABBITMQ_PORT" \
	--vhost "$RABBITMQ_VHOST" \
	--exchange "$RABBITMQ_EXCHANGE" \
	--key "$AUTH_ACCESS_KEY" \
	--db_host "$DB_HOST" \
	--db_port "$DB_PORT" \
	--db_username "$DB_USERNAME" \
	--db_password "$DB_PASSWORD" \
	--db_name "$DB_DBNAME"
