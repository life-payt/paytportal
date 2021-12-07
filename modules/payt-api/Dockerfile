FROM node:lts-jessie-slim
MAINTAINER Andre Silva Santos

COPY ./server-application /server-application

RUN cd /server-application && npm cache clean --force
RUN cd /server-application && npm install 
RUN cd /server-application && npm install --save loopback-connector-mongodb 
RUN cd /server-application && npm install nodemailer-smtp-transport

CMD node /server-application
