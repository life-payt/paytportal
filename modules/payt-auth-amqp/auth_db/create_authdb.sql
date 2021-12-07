--
-- Auth Database creation script
-- creates schema and adds default values for roles
--

CREATE SCHEMA authdb;


CREATE TABLE authdb.roles (
    id      integer     NOT NULL,
    role    varchar(10) NOT NULL
);

CREATE TABLE authdb.users (
    user_id     serial          UNIQUE,
    username    varchar(30)     NOT NULL,
    email       varchar(50),
    alias       varchar(50),
    role        integer         NOT NULL,
    salt        varchar(140)    NOT NULL,
    passhash    varchar(140)    NOT NULL,
    master_ph   varchar(140)    NOT NULL,
    validated   integer         default 0,
    last_access date
);

CREATE TABLE authdb.customers (
    id          serial,
    username    varchar(30)     NOT NULL,
    county      integer NOT NULL
);

CREATE TABLE authdb.countyadmins (
    id          serial,
    username    varchar(30)     NOT NULL UNIQUE,
    county      integer         NOT NULL
);

CREATE TABLE authdb.counties (
    id      integer         NOT NULL,
    county  varchar(30)     NOT NULL
);

CREATE TABLE authdb.validation_status (
	id      integer     not null,
	status  varchar(20)
);

CREATE TABLE authdb.services (
	id      serial,
	name    varchar(50)     NOT NULL UNIQUE,
	salt    varchar(140)    NOT NULL,
	secret  varchar(140)    NOT NULL
);

CREATE TABLE authdb.banned_users (
    id      serial,
    user_id integer     NOT NULL UNIQUE,
    ban_end varchar(20) NOT NULL
);

CREATE TABLE authdb.failed_logins (
    id          serial,
    user_id     integer     NOT NULL,
    date_time   TIMESTAMP   DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE authdb.policies (
    id      serial,
    field   varchar(50)     not null unique,
    polic   varchar(30)
);

CREATE TABLE authdb.functions (
    id          serial,
    func        varchar(60)     not null unique,
    ret         varchar(50),
    operation   varchar(20)     not null
);

CREATE TABLE authdb.api_users (
    id          serial,
    email       varchar(50)     not null,
    username    varchar(50)     not null unique,
    county      varchar(20),
    userid      varchar(80)
);

ALTER TABLE ONLY authdb.api_users
    ADD CONSTRAINT api_users_pkey PRIMARY KEY (id);

ALTER TABLE ONLY authdb.policies
    ADD CONSTRAINT policies_pkey PRIMARY KEY (id);

ALTER TABLE ONLY authdb.functions
    ADD CONSTRAINT funcs_pkey PRIMARY KEY (id);

ALTER TABLE ONLY authdb.banned_users
    ADD CONSTRAINT busers_pkey PRIMARY KEY (id);

ALTER TABLE ONLY authdb.banned_users
    ADD CONSTRAINT userid_fkey FOREIGN KEY (user_id) REFERENCES authdb.users(user_id)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE ONLY authdb.failed_logins
    ADD CONSTRAINT failed_pkey PRIMARY KEY (id);

ALTER TABLE ONLY authdb.failed_logins
    ADD CONSTRAINT userid_fkey FOREIGN KEY (user_id) REFERENCES authdb.users(user_id)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE ONLY authdb.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);

ALTER TABLE ONLY authdb.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);

ALTER TABLE ONLY authdb.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);

ALTER TABLE ONLY authdb.counties
    ADD CONSTRAINT counties_pk PRIMARY KEY (id);

ALTER TABLE ONLY authdb.countyadmins
    ADD CONSTRAINT ctyadmins_pk PRIMARY KEY (id);

ALTER TABLE ONLY authdb.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (username);

ALTER TABLE ONLY authdb.countyadmins
    ADD CONSTRAINT username_fkey FOREIGN KEY (username) REFERENCES authdb.users(username)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE ONLY authdb.users
    ADD CONSTRAINT role_id FOREIGN KEY (role) REFERENCES authdb.roles(id) 
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE ONLY authdb.customers
    ADD CONSTRAINT cust_username_fkey FOREIGN KEY (username) REFERENCES authdb.users(username) 
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE ONLY authdb.customers
    ADD CONSTRAINT cust_county_fkey FOREIGN KEY (county) REFERENCES authdb.counties(id) 
    ON DELETE CASCADE ON UPDATE CASCADE;

alter table only authdb.validation_status
	add constraint vlst_pk primary key (id);

CREATE or replace FUNCTION preventDelete() RETURNS trigger AS $$
    begin
        if old.user_id = 1 then
            return null;
        end if;
        RETURN old;
    end;
$$ LANGUAGE plpgsql;

create trigger preventDel
before delete on authdb.users
for each row execute procedure preventDelete();

INSERT INTO authdb.roles VALUES (1, 'admin');
INSERT INTO authdb.roles VALUES (2, 'county');
INSERT INTO authdb.roles VALUES (3, 'user');

INSERT INTO authdb.counties VALUES (1, 'aveiro');
INSERT INTO authdb.counties VALUES (2, 'lisbon');
INSERT INTO authdb.counties VALUES (3, 'caoli');
------
INSERT INTO authdb.counties VALUES (4, 'condeixa');
INSERT INTO authdb.counties VALUES (5, 'larnaka');
INSERT INTO authdb.counties VALUES (6, 'vrilissia')
	
insert into authdb.validation_status values(0, 'unvalidated');	
insert into authdb.validation_status values(1, 'validated');	
insert into authdb.validation_status values(2, 'deactivated');	
insert into authdb.validation_status values(3, 'former client');
insert into authdb.validation_status values(4, 'forgotten');

alter table only authdb.users
	add constraint val_fk foreign key (validated) references authdb.validation_status(id)
	on update cascade;

insert into authdb.policies (field)
select concat(table_name::text,'.',column_name::text) as field from information_schema.columns
where table_schema = 'authdb';

update authdb.policies set polic = 'public' where id > 0;