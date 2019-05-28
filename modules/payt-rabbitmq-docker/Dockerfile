FROM rabbitmq:3.6.12

ENV AUTH_PLUGIN amqp
ENV AUTH_ACCESS_KEY lifepayt

RUN apt-get update && apt-get -y install wget python

RUN wget -O rabbitmq_auth_backend_amqp-3.6.12.ez https://bintray.com/rabbitmq/community-plugins/download_file?file_path=rabbitmq_auth_backend_amqp-3.6.x-d1d2d20f.ez

RUN wget -O rabbitmq_auth_backend_http-3.6.12.ez https://bintray.com/rabbitmq/community-plugins/download_file?file_path=rabbitmq_auth_backend_http-3.6.12.ez

RUN wget -O rabbitmq_auth_backend_cache-3.6.12-otp-19.3.ez https://github.com/rabbitmq/rabbitmq-auth-backend-cache/releases/download/rabbitmq_v3_6_12/rabbitmq_auth_backend_cache-3.6.12-otp-19.3.ez

RUN wget https://github.com/airboxlab/rabbitmq-topic-authorization/releases/download/v3.6.6/rabbitmq_topic_authorization.ez
RUN mv rabbitmq_topic_authorization.ez /plugins/

RUN mv rabbitmq_auth_backend* /plugins/

COPY rabbitmq.config /etc/rabbitmq/
COPY init.sh /

EXPOSE 5671 5672 25672 15672 61613 1935 8080
CMD ["/init.sh"]