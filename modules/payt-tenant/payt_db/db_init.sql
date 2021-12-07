CREATE SCHEMA payt;

CREATE TABLE payt.zone (
	zone_id				SERIAL			PRIMARY KEY,
	name				VARCHAR(50)		,
	location			VARCHAR(20)
);

CREATE TABLE payt.producer (
	producer_id			SERIAL			PRIMARY KEY,
	zone 				INTEGER			REFERENCES payt.zone(zone_id)
);

CREATE TABLE payt.card_status(
	id			SERIAL			PRIMARY KEY,
	status		varchar(30)		NOT NULL
);

INSERT INTO payt.card_status(status) values ('livre');
INSERT INTO payt.card_status(status) values ('atribuido');
INSERT INTO payt.card_status(status) values ('perdido');
INSERT INTO payt.card_status(status) values ('inativo');

CREATE TABLE payt.id_card (
	card_id				varchar(40)			PRIMARY KEY,
	status_id			INTEGER				REFERENCES payt.card_status(id)
);

CREATE TABLE payt.id_card_logs(
	id			SERIAL			PRIMARY KEY,
	card		varchar(40)		REFERENCES payt.id_card(card_id),
	producer	varchar(30),
	dt_ts		TIMESTAMP		DEFAULT CURRENT_TIMESTAMP,
	log_msg		varchar(100)
);

CREATE TABLE payt.producer_card (
	pi_id 				SERIAL			PRIMARY KEY,
	started				TIMESTAMP 		DEFAULT CURRENT_TIMESTAMP,
	ended				TIMESTAMP 		,
	card 				INTEGER			UNIQUE,
	producer 			INTEGER			REFERENCES payt.producer(producer_id)
);

CREATE TABLE payt.producer_cards (
	id			SERIAL		PRIMARY KEY,
	pi_ci		INTEGER		REFERENCES payt.producer_card(card),
	card		VARCHAR(40)		REFERENCES payt.id_card(card_id)
);

CREATE INDEX current_producer_card ON payt.producer_card (pi_id) WHERE ended IS NULL;
CREATE INDEX current_producer_cards_pi_ci ON payt.producer_cards (pi_ci);

CREATE TABLE payt.waste_type (
	waste_type_id		SERIAL			PRIMARY KEY,
	name				VARCHAR(30)		NOT NULL,
	repr_char			CHAR 			NOT NULL
);

INSERT INTO payt.waste_type (name, repr_char) VALUES ('Indiferenciados', 'I');
INSERT INTO payt.waste_type (name, repr_char) VALUES ('Papel/Cartão', 'P');
INSERT INTO payt.waste_type (name, repr_char) VALUES ('Vidro', 'V');
INSERT INTO payt.waste_type (name, repr_char) VALUES ('Embalagens', 'E');
INSERT INTO payt.waste_type (name, repr_char) VALUES ('Orgânicos', 'O');

CREATE TABLE payt.container (
	container_id		SERIAL			PRIMARY KEY,
	capacity			INTEGER			NOT NULL,
	deposit_volume		INTEGER			,
	lat					DOUBLE PRECISION,
	long				DOUBLE PRECISION,
	weekly_collect_days	INTEGER			,
	waste_type 			INTEGER			REFERENCES payt.waste_type(waste_type_id),
	cb_id				INTEGER			UNIQUE
);

CREATE TABLE payt.producer_container (
	pc_id 				SERIAL			PRIMARY KEY,
	started				TIMESTAMP 		DEFAULT CURRENT_TIMESTAMP,
	ended				TIMESTAMP 		,
	container			INTEGER			REFERENCES payt.container(container_id),
	producer 			INTEGER			REFERENCES payt.producer(producer_id)
);

CREATE INDEX current_producer_container ON payt.producer_container (pc_id) WHERE ended IS NULL;

CREATE TABLE payt.collection_operator (
	operator_id			SERIAL			PRIMARY KEY,
	name				VARCHAR(30)		NOT NULL
);

CREATE TABLE payt.container_operator (
	co_id 				SERIAL			PRIMARY KEY,
	started				TIMESTAMP 		DEFAULT CURRENT_TIMESTAMP,
	ended				TIMESTAMP 		,
	container 			INTEGER			REFERENCES payt.container(container_id),
	operator 			INTEGER			REFERENCES payt.collection_operator(operator_id)
);

CREATE INDEX current_container_operator ON payt.container_operator (co_id) WHERE ended IS NULL;

CREATE TABLE payt.garbage_collection (
	collection_id		SERIAL			PRIMARY KEY,
	collection_ts		TIMESTAMP 		DEFAULT CURRENT_TIMESTAMP,
	card 				VARCHAR(40)		REFERENCES payt.id_card(card_id),
	container 			INTEGER			REFERENCES payt.container(container_id),
	counter				INTEGER,
	CONSTRAINT unique_usage UNIQUE (card, container, collection_ts)
);

CREATE INDEX current_garbage_collection ON payt.garbage_collection (collection_id) WHERE card IS NULL;
CREATE INDEX current_garbage_collection_card ON payt.garbage_collection (card);

CREATE TABLE payt.address (
	address_id			SERIAL			PRIMARY KEY,
	address				VARCHAR(50)		,
	address2			VARCHAR(50)		,
	parish				VARCHAR(30)		,
	city 				VARCHAR(30)		,
	postal_code			VARCHAR(10)		,
	last_update			TIMESTAMP 		DEFAULT CURRENT_TIMESTAMP,
	alias				VARCHAR(50)
);

CREATE TABLE payt.activity (
	activity_id			SERIAL			PRIMARY KEY,
	name				VARCHAR(30)		NOT NULL
);

CREATE TABLE payt.organization (
	organ_id			SERIAL			PRIMARY	KEY,
	name 				VARCHAR(100) 	NOT NULL,
	tax_id				VARCHAR(10)		,
	address 			INTEGER			REFERENCES payt.address(address_id)
);

CREATE TABLE payt.business (
	business_id			SERIAL			PRIMARY KEY,
	name				VARCHAR(100)	NOT NULL,
	contract			VARCHAR(10)		,
	activity 			INTEGER			REFERENCES payt.activity(activity_id),
	organization		INTEGER			REFERENCES payt.organization(organ_id)
);

CREATE TABLE payt.person (
	person_id			SERIAL			PRIMARY KEY,
	name				VARCHAR(100)	NOT NULL,
	tax_id				VARCHAR(10)		,
	contract			VARCHAR(10)
);

CREATE TABLE payt.producer_party (
	pp_id 				SERIAL			PRIMARY KEY,
	client_id			VARCHAR(30)		,
	started				TIMESTAMP 		DEFAULT CURRENT_TIMESTAMP,
	ended				TIMESTAMP 		,
	address 			INTEGER			REFERENCES payt.address(address_id),
	person 				INTEGER			REFERENCES payt.person(person_id) DEFAULT NULL,
	business 			INTEGER			REFERENCES payt.business(business_id) DEFAULT NULL,
	producer 			INTEGER			REFERENCES payt.producer(producer_id)
);

CREATE INDEX current_producer_party ON payt.producer_party (pp_id) WHERE ended IS NULL;

CREATE TABLE payt.real_bill (
	rbill_id			SERIAL			PRIMARY KEY,
	issue_date			DATE 			,
	value				NUMERIC(10,2)	NOT NULL,
	period_begin		DATE,
	period_end			DATE,
	party 				INTEGER			REFERENCES payt.producer_party(pp_id),
	document_id			INTEGER			UNIQUE
);

CREATE TABLE payt.simulated_bill (
	sbill_id			SERIAL			PRIMARY KEY,
	issue_date			DATE 			,
	value				NUMERIC(10,2)	NOT NULL,
	period_begin		DATE,
	period_end			DATE,
	party 				INTEGER			REFERENCES payt.producer_party(pp_id)
);

CREATE TABLE payt.user_type (
	type_id				SERIAL			PRIMARY KEY,
	type_name			VARCHAR(30)		
);

INSERT INTO payt.user_type (type_name) VALUES ('personal');
INSERT INTO payt.user_type (type_name) VALUES ('business');

CREATE TABLE payt.users (
	user_id				INTEGER			PRIMARY KEY,
	person 				INTEGER			REFERENCES payt.person(person_id) DEFAULT NULL,
	business 			INTEGER			REFERENCES payt.business(business_id) DEFAULT NULL,
	type 				INTEGER			REFERENCES payt.user_type(type_id)
);

CREATE TABLE payt.producers_users_agg(
	id			SERIAL			PRIMARY KEY,
	user_id		INTEGER,
	status_str	varchar(20),
	name		varchar(50),
	email		varchar(50),
	p_id		INTEGER,
	contract	varchar(50),
	address		varchar(60),
	model		varchar(20),
	type		varchar(20)
);

CREATE TABLE payt.dayly_waste(
	id			SERIAL		PRIMARY KEY,
	day_date	varchar(15),
	month_year	varchar(15)	UNIQUE,
	waste		integer
);

CREATE TABLE payt.weekly_waste(
	id			SERIAL PRIMARY KEY,
	week_start	varchar(15) NOT NULL,
	week_end	varchar(15) NOT NULL,
	waste		integer,
	month_year	varchar(15) UNIQUE
);

CREATE TABLE payt.monthly_waste(
	id			SERIAL PRIMARY KEY,
	month_year	varchar(15) UNIQUE,
	waste		integer
);

CREATE INDEX index_active_user_id ON payt.producers_users_agg (user_id) where status_str = 'validated';

CREATE TABLE payt.mailing (
    user_id integer     PRIMARY KEY
);

CREATE TABLE payt.policies (
    id      serial,
    field   varchar(50)     not null unique,
    polic   varchar(30)
);

CREATE TABLE payt.functions (
    id          serial,
    func        varchar(60)     not null unique,
    ret         varchar(50),
    operation   varchar(20)     not null
);

ALTER TABLE ONLY payt.policies
    ADD CONSTRAINT policies_pkey PRIMARY KEY (id);

ALTER TABLE ONLY payt.functions
    ADD CONSTRAINT funcs_pkey PRIMARY KEY (id);

insert into payt.policies (field)
select concat(table_name::text,'.',column_name::text) as field from information_schema.columns
where table_schema = 'payt';

update payt.policies set polic = 'public' where id > 0;

ALTER TABLE payt.users 
	ADD COLUMN redirect BOOLEAN DEFAULT false;
