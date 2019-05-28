all: update build_all run_all

update: update_modules
	git pull

init_modules:
	git submodule update --init --recursive

update_modules:
	git submodule update --remote --recursive

build_all: build_http_server build_tenant build_auth build_rabbitmq
	
build_http_server:
	./modules/payt-http-server/build-docker-image.sh

build_tenant:
	./modules/payt-tenant/build-docker-image.sh

build_auth:
	./modules/payt-auth-amqp/build-docker-image.sh

build_rabbitmq:
	./modules/payt-rabbitmq-docker/build-docker-image.sh

build_api:
	./modules/payt-api/build-docker-file.sh production

run_all: run_memcached run_postgres run_rabbitmq run_auth run_http_server run_tenant run_api

run_api:
	@printf "\nStarting API Application...\n"
	docker run -d \
		-p 3000:3000 
		--name payt-api
		payt-api
	@printf "DONE\n\n"

run_memcached:
	@printf "\nStarting Memcached...\n"
	docker run -d \
		--name payt-memcached \
		-p 11211:11211 \
		memcached
	@printf "DONE\n\n"

run_postgres:
	@printf "\nStart Postgres Database...\n"
	docker run -d \
		--name payt-postgres \
		-e POSTGRES_PASSWORD=postgres_test_pw \
		-p 5432:5432 \
		postgres
	@printf "DONE\n\n"
	sleep 15

	@printf "Creating tenant databases...\n"
	( docker exec -it payt-postgres psql -U postgres -c "create database payt_tenant;" ; \
	docker exec -it payt-postgres psql -U postgres -c "create database payt_auth;" ; \
	docker cp modules/payt-tenant/payt_db/db_init.sql payt-postgres:/ ; \
	docker cp modules/payt-auth-amqp/auth_db/create_authdb.sql payt-postgres:/ ; \
	docker exec -it payt-postgres bash -c 'psql -U postgres -d payt_tenant < /db_init.sql' ; \
	docker exec -it payt-postgres bash -c 'psql -U postgres -d payt_auth < /create_authdb.sql')
	@printf "DONE\n\n"

run_rabbitmq:
	@printf "Starting RabbitMQ...\n"
	docker run -d \
		--name payt-rabbitmq \
		-e AUTH_ACCESS_KEY=testing_key_auth \
		-p 5672:5672 \
		-p 25672:25672 \
		-p 15672:15672 \
		-p 61613:61613 \
		-p 1935:1935 \
		-p 8080:8081 \
		payt-rabbitmq
	@printf "DONE\nWait 40 seconds for RabbitMQ to start... "
	sleep 40
	@printf "DONE\n\n"

run_auth:
	@printf "Start Auth Module...\n"
	docker run -d \
		--name payt-auth \
		-e AUTH_ACCESS_KEY=testing_key_auth \
		-e RABBITMQ_HOST=172.17.0.1 \
		-e DB_DBNAME=payt_auth \
		-e DB_HOST=172.17.0.1 \
		payt-auth-amqp
	@printf "DONE\nWait 5 seconds for Auth Module to start..."
	sleep 5
	@printf "DONE\n\n"

run_http_server:
	@printf "Start HTTP Server...\n"
	docker run -d \
		--name payt-http-server \
		-e RABBITMQ_HOST=172.17.0.1 \
		-e RABBITMQ_USER=httpserver \
		-e RABBITMQ_KEY=testing_key_http \
		-e MEMCACHED_HOST=172.17.0.1 \
		-p 8000:80 \
		payt-http-server
	@printf "DONE\n\n"

run_tenant:
	@printf "Start Tenant for tenant...\n"
	docker run -d \
		--name payt-tenant \
		-e TENANT_NAME=tenant \
		-e RABBITMQ_HOST=172.17.0.1 \
		-e RABBITMQ_USER=payt_tenant \
		-e RABBITMQ_KEY=testing_key_tenant \
		-e DB_DBNAME=payt_tenant \
		-e DB_HOST=172.17.0.1 \
		-e MEMCACHED_HOST=172.17.0.1 \
		payt-tenant
	@printf "DONE\n\n"

remove_temp_images:
	-docker rmi $(docker images -f "dangling=true" -q)

remove_images: remove_temp_images
	-docker rmi payt-tenant payt-http-server payt-auth-amqp payt-rabbitmq

stop_all: stop_postgres stop_rabbitmq stop_tenant stop_auth stop_http_server stop_memcached

stop_auth:
	-docker stop payt-auth

start_auth:
	-docker start payt-auth
	sleep 5

stop_postgres:
	-docker stop payt-postgres

start_postgres:
	-docker start payt-postgres
	sleep 15

stop_rabbitmq:
	-docker stop payt-rabbitmq

start_rabbitmq:
	-docker start payt-rabbitmq
	sleep 40

stop_tenant:
	-docker stop payt-tenant

start_tenant:
	-docker start payt-tenant

stop_http_server:
	-docker stop payt-http-server

start_http_server:
	-docker start payt-http-server

stop_memcached:
	-docker stop payt-memcached

start_memcached:
	-docker start payt-memcached

clean_containers: stop_all remove_auth remove_postgres remove_rabbitmq remove_tenant remove_http_server remove_memcached

remove_memcached:
	-docker rm payt-memcached

remove_auth:
	-docker rm payt-auth

remove_rabbitmq:
	-docker rm payt-rabbitmq

remove_postgres:
	-docker rm payt-postgres

remove_tenant:
	-docker rm payt-tenant

remove_http_server:
	-docker rm payt-http-server

clean: stop_all clean_containers

clean_all: clean_containers remove_images remove_temp_images

start_all: start_memcached start_postgres start_rabbitmq start_auth start_http_server start_tenant
