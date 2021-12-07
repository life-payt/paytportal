FROM python:3.7-stretch
MAINTAINER Andre Santos

ENV TENANT_NAME tenant_name
ENV RABBITMQ_HOST 127.0.0.1
ENV RABBITMQ_PORT 1935
ENV RABBITMQ_VHOST payt
ENV RABBITMQ_USER anonymous
ENV RABBITMQ_KEY anonymous
ENV DB_HOST 127.0.0.1
ENV DB_PORT 5432
ENV DB_USERNAME postgres
ENV DB_PASSWORD lifepayt
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
ENV W_STATE None
ENV E_NAME none
ENV E_URL_CKAN none
ENV E_API_KEY none
ENV E_COUNTY none

COPY temp/yaasc-python /yaasc

#RUN    apk --update upgrade \
#	&& apk add postgresql-dev \
#	&& apk add --virtual build-base \
#   && pip install --no-cache-dir -U pip

RUN apt update && apt upgrade -y
RUN pip install --upgrade pip
RUN apt install python3-numpy -y && apt install python3-pandas -y

ADD . /tenant
RUN rm /tenant/tenant.cfg

#RUN apk add --no-cache python3-dev libstdc++ && \
#    apk add --no-cache g++ && \
#    ln -s /usr/include/locale.h /usr/include/xlocale.h

#RUN apk update && \
#    apk upgrade && \
#    apk add --no-cache libstdc++ && \
#    apk add --no-cache --virtual=build_deps g++ gfortran && \
#    ln -s /usr/include/locale.h /usr/include/xlocale.h && \
#    pip install --no-cache-dir pandas && \
#    rm /usr/include/xlocale.h && \
#    apk del build_deps

RUN pip install -r /tenant/requirements.txt
RUN cd /yaasc && python setup.py install

#RUN echo "http://dl-cdn.alpinelinux.org/alpine/latest-stable/main" > /etc/apk/repositories
#RUN echo "http://dl-cdn.alpinelinux.org/alpine/latest-stable/community" >> /etc/apk/repositories
#RUN apk --no-cache --update-cache add gcc gfortran python python-dev py-pip build-base wget freetype-dev libpng-dev openblas-dev
#RUN ln -s /usr/include/locale.h /usr/include/xlocale.h
#RUN pip install numpy scipy pandas matplotlib


CMD /tenant/start.sh