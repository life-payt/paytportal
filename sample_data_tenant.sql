------------ Zones

INSERT INTO payt.zone (name, location) VALUES ('Forca', '40.638349,-8.637561');

------------ Producers

--CITIZENS
INSERT INTO payt.producer (zone) VALUES (1);
INSERT INTO payt.producer (zone) VALUES (1);

--BUSINESS
INSERT INTO payt.producer (zone) VALUES (1);
INSERT INTO payt.producer (zone) VALUES (1);

------------ ID Cards

INSERT INTO payt.id_card (card_id) VALUES (88888888);
INSERT INTO payt.id_card (card_id) VALUES (77777777);


------------ Producer Cards

INSERT INTO payt.producer_card (card, producer) VALUES (1, 1);
INSERT INTO payt.producer_card (card, producer) VALUES (2, 2);

INSERT INTO payt.producer_cards (pi_ci, card) VALUES (1, 88888888);
INSERT INTO payt.producer_cards (pi_ci, card) VALUES (2, 77777777);


------------ Containers

--CITIZENS
INSERT INTO payt.container (capacity, deposit_volume, location, weekly_collect_days, waste_type) VALUES (1000, 50, '40.639888,-8.637705',2,1);
INSERT INTO payt.container (capacity, deposit_volume, location, weekly_collect_days, waste_type) VALUES (500, 30, '40.638349,-8.637561',2,1);

--BUSINESS
INSERT INTO payt.container (capacity, deposit_volume, location, weekly_collect_days, waste_type) VALUES (500, 50, '40.639122,-8.635848',2,2);
INSERT INTO payt.container (capacity, deposit_volume, location, weekly_collect_days, waste_type) VALUES (500, 50, '40.639122,-8.635848',1,3);
INSERT INTO payt.container (capacity, deposit_volume, location, weekly_collect_days, waste_type) VALUES (2000, 50, '40.639122,-8.635848',3,4);

INSERT INTO payt.container (capacity, deposit_volume, location, weekly_collect_days, waste_type) VALUES (500, 50, '40.638432,-8.638891',2,2);
INSERT INTO payt.container (capacity, deposit_volume, location, weekly_collect_days, waste_type) VALUES (2000, 50, '40.638432,-8.638891',2,3);
INSERT INTO payt.container (capacity, deposit_volume, location, weekly_collect_days, waste_type) VALUES (2000, 50, '40.638432,-8.638891',3,4);

------------ Producer's Containers

--BUSINESS ONLY
INSERT INTO payt.producer_container (producer, container) VALUES (3, 3);
INSERT INTO payt.producer_container (producer, container) VALUES (3, 4);
INSERT INTO payt.producer_container (producer, container) VALUES (3, 5);

INSERT INTO payt.producer_container (producer, container) VALUES (4, 6);
INSERT INTO payt.producer_container (producer, container) VALUES (4, 7);
INSERT INTO payt.producer_container (producer, container) VALUES (4, 8);

------------ Containers Collection Operator

INSERT INTO payt.collection_operator (name) VALUES ('CMA');
INSERT INTO payt.collection_operator (name) VALUES ('Privado');


------------ Containers Operators

--BUSINESS ONLY
INSERT INTO payt.container_operator (container, operator) VALUES (1,1);
INSERT INTO payt.container_operator (container, operator) VALUES (1,1);
INSERT INTO payt.container_operator (container, operator) VALUES (1,1);
INSERT INTO payt.container_operator (container, operator) VALUES (1,1);
INSERT INTO payt.container_operator (container, operator) VALUES (1,1);
INSERT INTO payt.container_operator (container, operator) VALUES (1,2);
INSERT INTO payt.container_operator (container, operator) VALUES (1,2);
INSERT INTO payt.container_operator (container, operator) VALUES (1,2);

------------ Garbage Collections

--CIZITENS
INSERT INTO payt.garbage_collection (collection_ts,card, container)
select 	(timestamp '2016-05-10 00:00:00' + random() * (timestamp '2018-03-30 22:00:00' - timestamp '2016-05-01 10:00:00') ),
		(case when random() > 0.5 then 88888888 else 77777777 end),
		(trunc(random()*2+1))
from generate_series(1,2000) as x where x%3 = trunc(random()*10);

--BUSINESS
INSERT INTO payt.garbage_collection (collection_ts,card, container)
select 	(timestamp '2016-05-10 00:00:00' + random() * (timestamp '2018-03-30 22:00:00' - timestamp '2016-05-01 10:00:00') ),
		NULL,
		(trunc(random()*2.9+3))
from generate_series(1,2000) as x where x%3 = trunc(random()*10);

------------ Addresses

INSERT INTO payt.address (address, address2, parish, city, postal_code) VALUES ('R. Dom António José Cordeiro', 'N1, Andar1', 'Forca', 'Aveiro', '1234-567');
INSERT INTO payt.address (address, address2, parish, city, postal_code) VALUES ('R. de Moçambique', 'N2, Andar2', 'Forca', 'Aveiro', '7654-321');
INSERT INTO payt.address (address, address2, parish, city, postal_code) VALUES ('R. Dom António José Cordeiro', 'N3, Andar3', 'Forca', 'Aveiro', '1234-567');
INSERT INTO payt.address (address, address2, parish, city, postal_code) VALUES ('R. de Moçambique', 'N4, Andar4', 'Forca', 'Aveiro', '7654-321');

------------ Activities

INSERT INTO payt.activity (name) VALUES ('Hotelaria');
INSERT INTO payt.activity (name) VALUES ('Indústria');
INSERT INTO payt.activity (name) VALUES ('Ensino');

------------ Organizations

INSERT INTO payt.organization (name,tax_id,address) VALUES ('Empresa 1', '12345678', 1);
INSERT INTO payt.organization (name,tax_id,address) VALUES ('Empresa 2', '12333378', 2);

------------ Business

INSERT INTO payt.business (name,contract,activity,organization) VALUES ('Restaurante ', 'CMA', 1, 1);
INSERT INTO payt.business (name,contract,activity,organization) VALUES ('Fábrica', 'CMA', 2, 2);

------------ People

INSERT INTO payt.person (name, tax_id, contract) VALUES ('António Silva', '12344321', 'CMA');
INSERT INTO payt.person (name, tax_id, contract) VALUES ('Manuel Correia', '43211234', 'CMA');

------------ Parties

--CITIZENS
INSERT INTO payt.producer_party (address, person, producer) VALUES (3,1,1);
INSERT INTO payt.producer_party (address, person, producer) VALUES (4,2,2);

--BUSINESS
INSERT INTO payt.producer_party (address, business, producer) VALUES (1,1,3);
INSERT INTO payt.producer_party (address, business, producer) VALUES (2,2,4);


------------ Real Bills

INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2016-06-30', round(cast(random()*20+10 as numeric), 2), 1);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2016-07-31', round(cast(random()*20+10 as numeric), 2), 1);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2016-08-30', round(cast(random()*20+10 as numeric), 2), 1);

INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2016-09-30', round(cast(random()*20+10 as numeric), 2), 2);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2016-10-31', round(cast(random()*20+10 as numeric), 2), 2);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2016-11-30', round(cast(random()*20+10 as numeric), 2), 2);

INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2016-09-30', round(cast(random()*20+10 as numeric), 2), 3);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2016-10-31', round(cast(random()*20+10 as numeric), 2), 3);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2016-11-30', round(cast(random()*20+10 as numeric), 2), 3);

INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2016-09-30', round(cast(random()*20+10 as numeric), 2), 4);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2016-10-31', round(cast(random()*20+10 as numeric), 2), 4);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2016-11-30', round(cast(random()*20+10 as numeric), 2), 4);

INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2016-09-30', round(cast(random()*20+10 as numeric), 2), 1);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2016-10-31', round(cast(random()*20+10 as numeric), 2), 1);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2016-11-30', round(cast(random()*20+10 as numeric), 2), 1);

INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2016-03-31', round(cast(random()*20+10 as numeric), 2), 2);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2016-04-30', round(cast(random()*20+10 as numeric), 2), 2);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2016-05-31', round(cast(random()*20+10 as numeric), 2), 2);

INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2016-03-31', round(cast(random()*20+10 as numeric), 2), 3);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2016-04-30', round(cast(random()*20+10 as numeric), 2), 3);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2016-05-31', round(cast(random()*20+10 as numeric), 2), 3);

INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2016-03-31', round(cast(random()*20+10 as numeric), 2), 4);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2016-04-30', round(cast(random()*20+10 as numeric), 2), 4);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2016-05-31', round(cast(random()*20+10 as numeric), 2), 4);

INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2016-12-31', round(cast(random()*20+10 as numeric), 2), 1);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2017-01-31', round(cast(random()*20+10 as numeric), 2), 1);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2017-02-28', round(cast(random()*20+10 as numeric), 2), 1);

INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2016-12-31', round(cast(random()*20+10 as numeric), 2), 2);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2017-01-31', round(cast(random()*20+10 as numeric), 2), 2);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2017-02-28', round(cast(random()*20+10 as numeric), 2), 2);

INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2016-12-31', round(cast(random()*20+10 as numeric), 2), 3);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2017-01-31', round(cast(random()*20+10 as numeric), 2), 3);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2017-02-28', round(cast(random()*20+10 as numeric), 2), 3);

INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2016-12-31', round(cast(random()*20+10 as numeric), 2), 4);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2017-01-31', round(cast(random()*20+10 as numeric), 2), 4);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2017-02-28', round(cast(random()*20+10 as numeric), 2), 4);

INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2017-03-31', round(cast(random()*20+10 as numeric), 2), 1);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2017-04-30', round(cast(random()*20+10 as numeric), 2), 1);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2017-05-31', round(cast(random()*20+10 as numeric), 2), 1);

INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2017-03-31', round(cast(random()*20+10 as numeric), 2), 2);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2017-04-30', round(cast(random()*20+10 as numeric), 2), 2);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2017-05-31', round(cast(random()*20+10 as numeric), 2), 2);

INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2017-03-31', round(cast(random()*20+10 as numeric), 2), 3);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2017-04-30', round(cast(random()*20+10 as numeric), 2), 3);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2017-05-31', round(cast(random()*20+10 as numeric), 2), 3);

INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2017-03-31', round(cast(random()*20+10 as numeric), 2), 4);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2017-04-30', round(cast(random()*20+10 as numeric), 2), 4);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2017-05-31', round(cast(random()*20+10 as numeric), 2), 4);

INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2017-06-30', round(cast(random()*20+10 as numeric), 2), 1);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2017-06-30', round(cast(random()*20+10 as numeric), 2), 2);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2017-06-30', round(cast(random()*20+10 as numeric), 2), 3);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2017-06-30', round(cast(random()*20+10 as numeric), 2), 4);

INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2017-07-31', round(cast(random()*20+10 as numeric), 2), 1);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2017-07-31', round(cast(random()*20+10 as numeric), 2), 2);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2017-07-31', round(cast(random()*20+10 as numeric), 2), 3);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2017-07-31', round(cast(random()*20+10 as numeric), 2), 4);

INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2017-08-30', round(cast(random()*20+10 as numeric), 2), 1);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2017-08-30', round(cast(random()*20+10 as numeric), 2), 2);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2017-08-30', round(cast(random()*20+10 as numeric), 2), 3);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2017-08-30', round(cast(random()*20+10 as numeric), 2), 4);

INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2017-09-30', round(cast(random()*20+10 as numeric), 2), 1);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2017-09-30', round(cast(random()*20+10 as numeric), 2), 2);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2017-09-30', round(cast(random()*20+10 as numeric), 2), 3);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2017-09-30', round(cast(random()*20+10 as numeric), 2), 4);

INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2017-10-30', round(cast(random()*20+10 as numeric), 2), 1);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2017-10-30', round(cast(random()*20+10 as numeric), 2), 2);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2017-10-30', round(cast(random()*20+10 as numeric), 2), 3);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2017-10-30', round(cast(random()*20+10 as numeric), 2), 4);

INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2017-11-30', round(cast(random()*20+10 as numeric), 2), 1);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2017-11-30', round(cast(random()*20+10 as numeric), 2), 2);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2017-11-30', round(cast(random()*20+10 as numeric), 2), 3);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2017-11-30', round(cast(random()*20+10 as numeric), 2), 4);

INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2017-12-30', round(cast(random()*20+10 as numeric), 2), 1);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2017-12-30', round(cast(random()*20+10 as numeric), 2), 2);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2017-12-30', round(cast(random()*20+10 as numeric), 2), 3);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2017-12-30', round(cast(random()*20+10 as numeric), 2), 4);

INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2018-01-30', round(cast(random()*20+10 as numeric), 2), 1);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2018-01-30', round(cast(random()*20+10 as numeric), 2), 2);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2018-01-30', round(cast(random()*20+10 as numeric), 2), 3);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2018-01-30', round(cast(random()*20+10 as numeric), 2), 4);

INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2018-02-28', round(cast(random()*20+10 as numeric), 2), 1);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2018-02-28', round(cast(random()*20+10 as numeric), 2), 2);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2018-02-28', round(cast(random()*20+10 as numeric), 2), 3);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2018-02-28', round(cast(random()*20+10 as numeric), 2), 4);

INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2018-03-30', round(cast(random()*20+10 as numeric), 2), 1);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2018-03-30', round(cast(random()*20+10 as numeric), 2), 2);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2018-03-30', round(cast(random()*20+10 as numeric), 2), 3);
INSERT INTO payt.real_bill (issue_date, value, party) VALUES ('2018-03-30', round(cast(random()*20+10 as numeric), 2), 4);

------------ Simulated Bills

INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2016-06-30', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=1 and issue_date = '2016-06-30'), 1);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2016-07-31', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=1 and issue_date = '2016-07-31'), 1);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2016-08-30', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=1 and issue_date = '2016-08-30'), 1);

INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2016-09-30', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=2 and issue_date = '2016-09-30'), 2);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2016-10-31', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=2 and issue_date = '2016-10-31'), 2);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2016-11-30', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=2 and issue_date = '2016-11-30'), 2);

INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2016-09-30', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=3 and issue_date = '2016-09-30'), 3);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2016-10-31', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=3 and issue_date = '2016-10-31'), 3);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2016-11-30', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=3 and issue_date = '2016-11-30'), 3);

INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2016-09-30', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=4 and issue_date = '2016-09-30'), 4);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2016-10-31', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=4 and issue_date = '2016-10-31'), 4);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2016-11-30', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=4 and issue_date = '2016-11-30'), 4);

INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2016-09-30', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=1 and issue_date = '2016-09-30'), 1);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2016-10-31', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=1 and issue_date = '2016-10-31'), 1);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2016-11-30', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=1 and issue_date = '2016-11-30'), 1);

INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2016-03-31', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=2 and issue_date = '2016-03-31'), 2);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2016-04-30', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=2 and issue_date = '2016-04-30'), 2);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2016-05-31', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=2 and issue_date = '2016-05-31'), 2);

INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2016-03-31', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=3 and issue_date = '2016-03-31'), 3);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2016-04-30', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=3 and issue_date = '2016-04-30'), 3);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2016-05-31', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=3 and issue_date = '2016-05-31'), 3);

INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2016-03-31', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=4 and issue_date = '2016-03-31'), 4);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2016-04-30', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=4 and issue_date = '2016-04-30'), 4);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2016-05-31', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=4 and issue_date = '2016-05-31'), 4);

INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2016-12-31', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=1 and issue_date = '2016-12-31'), 1);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2017-01-31', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=1 and issue_date = '2017-01-31'), 1);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2017-02-28', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=1 and issue_date = '2017-02-28'), 1);

INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2016-12-31', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=2 and issue_date = '2016-12-31'), 2);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2017-01-31', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=2 and issue_date = '2017-01-31'), 2);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2017-02-28', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=2 and issue_date = '2017-02-28'), 2);

INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2016-12-31', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=3 and issue_date = '2016-12-31'), 3);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2017-01-31', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=3 and issue_date = '2017-01-31'), 3);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2017-02-28', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=3 and issue_date = '2017-02-28'), 3);

INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2016-12-31', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=4 and issue_date = '2016-12-31'), 4);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2017-01-31', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=4 and issue_date = '2017-01-31'), 4);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2017-02-28', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=4 and issue_date = '2017-02-28'), 4);

INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2017-03-31', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=1 and issue_date = '2017-03-31'), 1);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2017-04-30', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=1 and issue_date = '2017-04-30'), 1);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2017-05-31', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=1 and issue_date = '2017-05-31'), 1);

INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2017-03-31', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=2 and issue_date = '2017-03-31'), 2);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2017-04-30', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=2 and issue_date = '2017-04-30'), 2);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2017-05-31', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=2 and issue_date = '2017-05-31'), 2);

INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2017-03-31', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=3 and issue_date = '2017-03-31'), 3);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2017-04-30', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=3 and issue_date = '2017-04-30'), 3);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2017-05-31', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=3 and issue_date = '2017-05-31'), 3);

INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2017-03-31', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=4 and issue_date = '2017-03-31'), 4);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2017-04-30', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=4 and issue_date = '2017-04-30'), 4);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2017-05-31', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=4 and issue_date = '2017-05-31'), 4);

INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2017-06-30', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=1 and issue_date = '2017-06-30'), 1);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2017-06-30', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=2 and issue_date = '2017-06-30'), 2);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2017-06-30', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=3 and issue_date = '2017-06-30'), 3);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2017-06-30', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=4 and issue_date = '2017-06-30'), 4);

INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2017-07-31', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=1 and issue_date = '2017-07-31'), 1);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2017-07-31', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=2 and issue_date = '2017-07-31'), 2);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2017-07-31', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=3 and issue_date = '2017-07-31'), 3);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2017-07-31', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=4 and issue_date = '2017-07-31'), 4);

INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2017-08-31', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=1 and issue_date = '2017-08-30'), 1);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2017-08-31', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=2 and issue_date = '2017-08-30'), 2);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2017-08-31', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=3 and issue_date = '2017-08-30'), 3);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2017-08-31', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=4 and issue_date = '2017-08-30'), 4);

INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2017-09-30', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=1 and issue_date = '2017-09-30'), 1);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2017-09-30', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=2 and issue_date = '2017-09-30'), 2);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2017-09-30', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=3 and issue_date = '2017-09-30'), 3);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2017-09-30', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=4 and issue_date = '2017-09-30'), 4);

INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2017-10-30', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=1 and issue_date = '2017-10-30'), 1);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2017-10-30', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=2 and issue_date = '2017-10-30'), 2);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2017-10-30', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=3 and issue_date = '2017-10-30'), 3);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2017-10-30', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=4 and issue_date = '2017-10-30'), 4);

INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2017-11-30', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=1 and issue_date = '2017-11-30'), 1);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2017-11-30', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=2 and issue_date = '2017-11-30'), 2);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2017-11-30', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=3 and issue_date = '2017-11-30'), 3);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2017-11-30', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=4 and issue_date = '2017-11-30'), 4);

INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2017-12-30', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=1 and issue_date = '2017-12-30'), 1);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2017-12-30', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=2 and issue_date = '2017-12-30'), 2);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2017-12-30', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=3 and issue_date = '2017-12-30'), 3);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2017-12-30', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=4 and issue_date = '2017-12-30'), 4);

INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2018-01-30', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=1 and issue_date = '2018-01-30'), 1);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2018-01-30', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=2 and issue_date = '2018-01-30'), 2);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2018-01-30', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=3 and issue_date = '2018-01-30'), 3);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2018-01-30', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=4 and issue_date = '2018-01-30'), 4);

INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2018-02-28', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=1 and issue_date = '2018-02-28'), 1);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2018-02-28', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=2 and issue_date = '2018-02-28'), 2);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2018-02-28', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=3 and issue_date = '2018-02-28'), 3);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2018-02-28', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=4 and issue_date = '2018-02-28'), 4);

INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2018-03-30', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=1 and issue_date = '2018-03-30'), 1);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2018-03-30', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=2 and issue_date = '2018-03-30'), 2);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2018-03-30', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=3 and issue_date = '2018-03-30'), 3);
INSERT INTO payt.simulated_bill (issue_date, value, party) VALUES ('2018-03-30', (select (value - (round(cast(random()*8+5 as numeric)))) from payt.real_bill where party=4 and issue_date = '2018-03-30'), 4);

------------ Users
INSERT INTO payt.users (user_id, person, type) VALUES (2,1,1);
INSERT INTO payt.users (user_id, person, type) VALUES (3,2,1);

INSERT INTO payt.users (user_id, business, type) VALUES (4,1,2);
INSERT INTO payt.users (user_id, business, type) VALUES (5,2,2);
