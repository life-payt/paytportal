APPEND_END_DATE = " and collection_ts::date <= %s"
QUERIES = {
	'GET_WASTE_ID':		"""
							select waste_type_id
							from payt.waste_type
							where repr_char=%s
						""",

	'INSERT_GARBAGE':	"""
							insert into payt.garbage_collection (collection_ts, card, container)
							values (%s,%s,%s)
						""",


	'INSERT_P_CONTAINER':"""
							insert into payt.producer_container (producer, container)
							values (%s,%s)
						""",

	'GET_ID_CARDS_PAG':		"""
							select card_id from 
							payt.id_card
							order by card_id limit %s offset %s
						""",

	'GET_FREE_ID_CARDS_PAG':	"""
								SELECT card_id
								FROM payt.id_card
								where card_id not in
								(select card from payt.producer_cards)
								order by card_id limit %s offset %s
							""",

	'GET_ID_CARDS':		"""
							select card_id from 
							payt.id_card
						""",

	'GET_FREE_ID_CARDS':	"""
								SELECT card_id
								FROM payt.id_card
								where card_id not in
								(select card from payt.producer_cards)
							""",

	'GET_CARD_OWNER':		"""
								select pi_ci
								from payt.producer_cards
								where card = %s
							""",

	'EXIST_USAGES':		"""
							select count(collection_id)
							from payt.garbage_collection
						""",

	'INSERT_CONTAINER':	"""
							insert into payt.container (capacity, deposit_volume, lat, long, weekly_collect_days, waste_type, cb_id)
							values (%s,%s,%s,%s,%s,%s,%s)
						""",

	'GET_CONT_ID':		"""
							select container_id 
							from payt.container
							where cb_id = %s
						""",

	'GET_CONTAINERS':	"""
							select container_id, capacity, deposit_volume, long, lat, weekly_collect_days, repr_char
       						from payt.container join payt.waste_type on waste_type = waste_type_id

						""",

	'GET_CONTAINERS_ID':	"""
								select container_id from
								payt.container
							""",

	'CONTAINER_EXISTS':	"""
							select count(cb_id) from payt.container
							where cb_id=%s
						""",

	'INSERT_P_CARD':	"""
							insert into payt.producer_card (producer, card)
							values (%s,%s)
						""",


	'INSERT_CARD':		"""
							insert into payt.id_card (card_id, status_id)
							values (%s, 1)
							returning card_id
						""",

	'PARTY_ID':			"""
							select pp_id
							from payt.producer_party 
								full outer join payt.person on person=person_id 
								full outer join payt.business on business=business_id
								full outer join payt.organization on organization=organ_id 
							where client_id=%s and payt.producer_party.ended is null
						""",

	'INSERT_REAL_BILL':	"""
							insert into payt.real_bill (issue_date, value, party, period_begin, period_end)
							select %s, round(%s, 2), %s, %s, %s
							where
								not exists (
									select rbill_id 
									from payt.real_bill
									where issue_date=%s
										and value=round(%s, 2)
										and party=%s
										and period_begin=%s
										and period_end=%s
								);
						""",

	'INSERT_SIMU_BILL':	"""
							insert into payt.simulated_bill (issue_date, value, party)
							select %s, round(%s, 2), %s
							where
								not exists (
									select rbill_id 
									from payt.simulated_bill
									where issue_date=%s
										and value=round(%s, 2)
										and party=%s
								);
						""",

	'PERSON_ID':		"""
							select person_id
							from payt.person
							where tax_id=%s
						""",


	'INSERT_USER_P':	"""
							insert into payt.users (user_id, person, type)
							values (%s,%s,%s)
						""",

	'INSERT_USER_B':	"""
							insert into payt.users (user_id, business, type)
							values (%s,%s,%s)
						""",

	'USER_EXISTS':		"""
							select count(user_id)
							from payt.users
							where user_id=%s
						""",

	'INSERT_BUSINESS':		"""
							insert into payt.business (name, contract, activity, organization)
							values (%s,%s,%s,%s)
							returning business_id
						""",

	'ORG_ID':			"""
							select organ_id
							from payt.organization
							where tax_id=%s
						""",

	'INSERT_ORG':		"""
							insert into payt.organization (name, tax_id, address)
							values (%s,%s,%s)
							returning organ_id
						""",

	'INSERT_PERSON':	"""
							insert into payt.person (name, tax_id, contract)
							values (%s, %s, %s)
							returning person_id
						""",

	'ISRT_PROD_P_PARTY':"""
							insert into payt.producer_party (client_id, address, person, producer)
							values (%s,%s,%s,%s)
							returning pp_id
						""",

	'ISRT_PROD_B_PARTY':"""
							insert into payt.producer_party (client_id, address, business, producer)
							values (%s,%s,%s,%s)
							returning pp_id
						""",

	'INSERT_ADDRESS':	"""
							insert into payt.address (address, address2, parish, city, postal_code, alias)
							values (%s, %s, %s, %s, %s, %s)
							returning address_id
						""",

	'INSERT_PRODUCER':	"""
							insert into payt.producer (zone)
							values (%s)
							returning producer_id
						""",

	'PRODUCER_TYPE':	"""
							select type
							from (
								select client_id, concat(payt.person.tax_id, payt.organization.tax_id) as tid, coalesce(business, 0) = 0 is false as type
								from payt.producer_party 
									full outer join payt.person on person=person_id
									full outer join payt.business on business=business_id
									full outer join payt.organization on organization=organ_id
								where client_id=%s) t
							where tid=%s
						""",

	'PRODUCER_CLIENT_EXISTS':	"""
							select producer
							from (
								select producer, client_id, concat(payt.person.tax_id, payt.organization.tax_id) as tid
								from payt.producer_party 
									full outer join payt.person on person=person_id 
									full outer join payt.business on business=business_id
									full outer join payt.organization on organization=organ_id 
								where client_id=%s and payt.producer_party.ended is null) t 
							where tid=%s
						""",

	'ZONE_ID':			"""
							select zone_id
							from payt.zone
							where name=%s
						""",

	'INSERT_ZONE':		"""
							insert into payt.zone (name, location)
							values (%s,%s)
							returning zone_id
						""",

	'USER_PRODUCERS': 	"""
							select producer
							from payt.producer_party 
								join payt.users 
									on payt.producer_party.person = payt.users.person 
									or payt.producer_party.business = payt.users.business
							where payt.producer_party.ended is null and user_id=%s
						""",

	'PRODUCER_CARDS':	"""
							select card
							from payt.producer_cards
							where pi_ci=%s
						""",

	'PRODUCER_ZONE':	"""
							select zone 
							from payt.producer
							where producer_id=%s
						""",

	'PARTY_TYPE':		"""
							select person,business,type_name as type
							from payt.users
								join payt.user_type on type = type_id
							where user_id=%s
						""",

	'GET_PARTY_TYPE':	"""
							select type_name as type
							from payt.users
								join payt.user_type on type = type_id
							where user_id=%s
						""",

	'PERSON_INFO':		"""
							select name, contract
							from payt.person
							where person_id=%s
						""",

	'BUSINESS_INFO':	"""
							select name, contract
							from payt.business
							where business_id=%s
						""",

	'PERSON_PRODUCERS':	"""
							select payt.producer_party.producer, payt.address.address,address2,alias,
							case when card is null then 'container' else 'card' end as model
							from payt.producer_party 
								join payt.address on payt.producer_party.address = address_id
								left join payt.producer_card on payt.producer_card.producer = payt.producer_party.producer
							where person=%s and payt.producer_party.ended is null and payt.producer_card.ended is null
						""",

	'BUSINESS_PRODUCERS':"""
							select payt.producer_party.producer, payt.address.address,address2,alias,
							case when card is null then 'container' else 'card' end as model
							from payt.producer_party 
								join payt.address on payt.producer_party.address = address_id
								left join payt.producer_card on payt.producer_card.producer = payt.producer_party.producer
							where business=%s and payt.producer_party.ended is null and payt.producer_card.ended is null
						""",

	'CARD_MONTH_WASTE':"""
							select date_trunc('month', collection_ts) AS c_month, repr_char as waste_type, sum(deposit_volume)
							from payt.garbage_collection
								join payt.container on container = container_id
								join payt.waste_type on waste_type = waste_type_id
							where card=%s and collection_ts::date >= %s{0}
							group by c_month, repr_char
						""",

	'CONTAINER_MONTH_WASTE':"""
							select date_trunc('month', collection_ts) AS c_month, repr_char as waste_type, sum(capacity)
							from payt.garbage_collection
								join payt.container on container = container_id
								join payt.waste_type on waste_type = waste_type_id
								join payt.producer_container on payt.garbage_collection.container = payt.producer_container.container
							where card is null and producer=%s and collection_ts::date >= %s{0}
							group by c_month, repr_char
						""",

	'PRODUCER_REAL_BILL':"""
							select issue_date, value, period_begin, period_end
							from payt.real_bill join payt.producer_party on party=pp_id
							where ended is null and producer=%s and issue_date::date >= %s
							order by issue_date desc
							fetch first 1 rows only
						""",

	'PRODUCER_SIMULATED_BILL':"""
							select issue_date, value
							from payt.simulated_bill join payt.producer_party on party=pp_id
							where ended is null and producer=%s and issue_date::date >= %s
							order by issue_date desc
							fetch first 1 rows only
						""",

	'PRODUCER_REAL_BILLS':"""
							select issue_date, value, period_begin, period_end
							from payt.real_bill join payt.producer_party on party=pp_id
							where ended is null and producer=%s and issue_date::date >= %s
						""",

	'PRODUCER_SIMULATED_BILLS':"""
							select issue_date, value
							from payt.simulated_bill join payt.producer_party on party=pp_id
							where ended is null and producer=%s and issue_date::date >= %s
						""",

	'CARD_DAY_AVERAGE':"""
							select repr_char as waste_type, round(avg(day_total),2)
							from (	select date_trunc('day', collection_ts) "day", repr_char, sum(deposit_volume) as day_total
									from payt.garbage_collection
										join payt.container on container = container_id
										join payt.waste_type on waste_type = waste_type_id
									where card=%s and collection_ts::date >= %s{0}
									group by day, repr_char) s1
							group by waste_type
						""",

	'CARD_ZONE_DAY_AVERAGE':"""
							select waste_type, round(avg(producer_average),2)	
							from (	select producer, waste_type, avg(day_total) as producer_average 
									from (	select producer, repr_char as waste_type, date_trunc('day', collection_ts) "day", sum(deposit_volume) as day_total 
											from payt.garbage_collection 
												join payt.container on container = container_id
												join payt.producer_card on payt.garbage_collection.card = payt.producer_card.card
												join payt.producer on producer = producer_id
												join payt.waste_type on waste_type = waste_type_id
											where payt.garbage_collection.card is not null and zone=%s and collection_ts::date >= %s{0}
											group by day, producer, repr_char) s1 
									group by producer, waste_type) s2
							group by waste_type
						""",

	'CONTAINER_DAY_AVERAGE':"""
							select repr_char as waste_type, round(avg(day_total),2)
							from (	select date_trunc('day', collection_ts) "day", repr_char, sum(capacity) as day_total
									from 	payt.garbage_collection
										join payt.container on container = container_id
										join payt.waste_type on waste_type = waste_type_id
										join payt.producer_container on payt.garbage_collection.container = payt.producer_container.container
									where card is null and producer=%s and collection_ts::date >= %s{0}
									group by day, repr_char) s1
							group by waste_type
						""",

	'CONTAINER_ZONE_DAY_AVERAGE':"""
							select waste_type, round(avg(producer_average),2)	
							from (	select producer, waste_type, avg(day_total) as producer_average 
									from (	select producer, repr_char as waste_type, date_trunc('day', collection_ts) "day", sum(capacity) as day_total 
											from payt.garbage_collection 
											join payt.container on container = container_id
											join payt.producer_container on payt.garbage_collection.container = payt.producer_container.container
											join payt.producer on producer = producer_id
											join payt.waste_type on waste_type = waste_type_id
											where payt.garbage_collection.card is null and zone=%s and collection_ts::date >= %s{0}
											group by day, producer, repr_char) s1 
									group by producer, waste_type) s2
							group by waste_type
						""",
	'GET_ALL_PERSON_IDS':	"""
								SELECT user_id FROM payt.users
							""",

	'GET_COUNT_PERSON_IDS':	"""
								SELECT count(user_id) FROM payt.users
							""",

	'GET_ALL_PERSON_IDS_PAG':	"""
								SELECT user_id FROM payt.users order by user_id limit %s offset %s
							""",

	'GET_OLDEST_ENTRY':		"""
								SELECT collection_ts 
								FROM payt.garbage_collection 
								order by collection_ts ASC 
								LIMIT 1
							""",
	'CARD_WEEK_WASTE':"""
							select date_trunc('week', collection_ts) AS c_week, repr_char as waste_type, sum(deposit_volume)
							from payt.garbage_collection
								join payt.container on container = container_id
								join payt.waste_type on waste_type = waste_type_id
							where card=%s and collection_ts::date >= %s{0}
							group by c_week, repr_char
						""",

	'CONTAINER_WEEK_WASTE':"""
							select date_trunc('week', collection_ts) AS c_week, repr_char as waste_type, sum(capacity)
							from payt.garbage_collection
								join payt.container on container = container_id
								join payt.waste_type on waste_type = waste_type_id
								join payt.producer_container on payt.garbage_collection.container = payt.producer_container.container
							where card is null and producer=%s and collection_ts::date >= %s{0}
							group by c_week, repr_char
						""",

	'CARD_DAY_WASTE':"""
							select date_trunc('day', collection_ts) AS c_day, repr_char as waste_type, sum(deposit_volume)
							from payt.garbage_collection
								join payt.container on container = container_id
								join payt.waste_type on waste_type = waste_type_id
							where card=%s and collection_ts::date >= %s{0}
							group by c_day, repr_char
						""",

	'CONTAINER_DAY_WASTE':"""
							select date_trunc('week', collection_ts) AS c_day, repr_char as waste_type, sum(capacity)
							from payt.garbage_collection
								join payt.container on container = container_id
								join payt.waste_type on waste_type = waste_type_id
								join payt.producer_container on payt.garbage_collection.container = payt.producer_container.container
							where card is null and producer=%s and collection_ts::date >= %s{0}
							group by c_day, repr_char
						""",

	'CONTAINER_TOTAL_DAY':	"""
								select count(container)
								from payt.garbage_collection
								where container = %s and collection_ts = %s
							""",

	'CONTAINER_TOTAL_INTERVAL':	"""
									select count(container)
									from payt.garbage_collection
									where container = %s and collection_ts >= %s and collection_ts <= %s
								""",

	'PRODUCER_EXISTS':	"""
								select producer from payt.producer_card
								where producer=%s
						""",

	'CARD_EXISTS':	"""
							select count(card_id) from payt.id_card
							where card_id = %s
					""",

	'DELETE_C_PRODUCER':	"""
								delete from payt.producer_cards
								where card=%s and pi_ci=%s
							""",

	'INSERT_C_PRODUCER':	"""
								insert into payt.producer_cards 
								(pi_ci, card) values
								(%s, %s)
							""",

	'DELETE_CARD':		"""
							delete from payt.id_card
							where card_id = %s
						""",

	'TOTAL_REAL_LASTM':	"""
							select sum(value) from payt.real_bill
							WHERE issue_date >= date_trunc('month', current_date - interval '1' month)
							and issue_date < date_trunc('month', current_date)
						""",

	'TOTAL_SIM_LASTM':	"""
							select sum(value) from payt.simulated_bill
							WHERE issue_date >= date_trunc('month', current_date - interval '1' month)
							and issue_date < date_trunc('month', current_date)
						""",

	'GET_PRODUCER_NAME':	"""
								select name
								from payt.person
								inner join payt.producer_party 
								on producer_party.person = person.person_id
								where payt.producer_party.producer = %s
							""",

	'GET_PRODUCER_NAME_BUS':"""
								select name
								from payt.business
								inner join payt.producer_party 
								on producer_party.business = payt.business.business_id
								where payt.producer_party.producer = %s
							""",

	'GET_PRODUCER_ADDRESS':	"""
								select concat(address.address,' - ', address2) as complete_address, concat(city,' - ',parish) as city, postal_code
								from payt.address
								inner join payt.producer_party
								on producer_party.address = address.address_id
								where payt.producer_party.producer = %s
							""",

	'GET_ALIAS':		"""
							select alias 
							from payt.address
							inner join payt.producer_party on payt.producer_party.address = payt.address.address_id
							where payt.producer_party.producer = %s
						""",

	'EDIT_ALIAS':		"""
							update payt.address
							set alias = %s
							where payt.address.address_id = (select address from payt.producer_party where producer = %s)
						""",

	'SEARCH_PERSON_ADDRESS':	"""
									select user_id 
									from payt.users
									where person in (select payt.producer_party.person from
									payt.producer_party
									inner join payt.address on payt.address.address_id = payt.producer_party.address
									where LOWER(payt.address.address) LIKE LOWER(%s))
								""",

	'SEARCH_BUS_ADDRESS':	"""
								select user_id 
								from payt.users
								where business in (
								select payt.producer_party.business from
								payt.producer_party
								inner join payt.address on payt.address.address_id = payt.producer_party.address
								where LOWER(payt.address.address) LIKE LOWER(%s))
							""",

	'SEARCH_PERSON_NAME':	"""
								select user_id 
								from payt.users
								where person in (select payt.producer_party.person from
								payt.producer_party
								inner join payt.person on payt.person.person_id = payt.producer_party.person
								where LOWER(payt.person.name) LIKE LOWER(%s))
							""",

	'SEARCH_BUS_NAME':	"""
								select user_id 
								from payt.users
								where business in (select payt.producer_party.business from
								payt.producer_party
								inner join payt.business on payt.business.business_id = payt.producer_party.business
								where LOWER(payt.business.name) LIKE LOWER(%s))
							""",

	'DROP_TABLE_PU':	"""
							DELETE FROM payt.producers_users_agg
							where id > 0
						""",

	'INSERT_TO_PU':		"""
							insert into payt.producers_users_agg
							(user_id, status_str, name, p_id, contract, address, model, type, email)
							values (%s, %s, %s, %s, %s, %s, %s, %s, %s)
						""",

	'COUNT_VALIDATED':	"""
							select count(user_id)
							from payt.producers_users_agg
							where status_str = 'validated'
						""",

	'SELECT_UP':		"""
							select user_id, status_str, name, p_id, contract, address, model, type, email
							from payt.producers_users_agg
							order by name limit %s offset %s
						""",

	'SELECT_UP_SEARCH':	"""
							select user_id, status_str, name, p_id, contract, address, model, type, email
							from payt.producers_users_agg
							where LOWER(name) LIKE LOWER(%s) or LOWER(address) LIKE LOWER(%s) or LOWER(email) LIKE LOWER(%s)
							order by name limit %s offset %s
						""",

	'COUNT_PROD_USERS':	"""
							select count(user_id)
							from payt.producers_users_agg
						""",

	'COUNT_PROD_USERS_RES':	"""
								select count(user_id)
								from payt.producers_users_agg
								where LOWER(name) LIKE LOWER(%s) or LOWER(address) LIKE LOWER(%s) or LOWER(email) LIKE LOWER(%s)
							""",

	'PRODUCE_CARD_LOG':	"""
							insert into payt.id_card_logs
							(card, producer, log_msg)
							values (%s, %s, %s)
						""",
	
	'PRODUCE_CARD_LOG_WP':	"""
								insert into payt.id_card_logs
								(card, log_msg)
								values (%s, %s)
							""",

	'GET_CARD_LOGS': 		"""
								select coalesce(producer,''), dt_ts, log_msg
								from payt.id_card_logs
								where card = %s
							""",

	'GET_CLIENT_ID':		"""
								select client_id
								from payt.producer_party
								where producer = %s
							""",

	'SET_NO_MAILING':	"""
							delete from payt.mailing
							where user_id = %s
						""",

	'SET_MAILING':		"""
							insert into payt.mailing
							(user_id) values (%s)
						""",

	'GET_UNACTIVE_PROD':	"""
								SELECT distinct party FROM payt.real_bill WHERE issue_date < NOW() - INTERVAL '180 days' and party 
								not in (select party from payt.real_bill WHERE issue_date > NOW() - INTERVAL '180 days')
							""",

	'GET_ALL_PROD':		"""
							select party
							from payt.producer_party
						""",

	'GET_USER_ID_PROD':		"""
								select user_id
								from payt.users 
								join payt.producer_party 
								on payt.producer_party.person = payt.users.person 
								or payt.producer_party.business = payt.users.business
								where ended is null and producer=%s
							""",

	'SET_PRODUCER_END':		"""
								update payt.producer_party
								set ended = %s
								where pp_id = %s
							""",

	'GET_LAST_BILL':		"""
								select issue_date
								from payt.real_bill
								where party = %s
								order by issue_date desc
								fetch first 1 rows only
							""",

	'GET_PID_PARTY':		"""
								select producer
								from payt.producer_party
								where pp_id = %s
							""",

	'SET_CARD_STATUS':		"""
								update payt.id_card
								set status_id = %s
								where card_id = %s
							""",

	'GET_CARD_STATUS':		"""
								select status_id
								from payt.id_card
								where card_id = %s
							""",

	'CKAN_TOTAL_RBILL':		"""
								select date_part('month', issue_date) as month, date_part('year', issue_date) as year, sum(value) as total 
								from payt.real_bill 
								group by month,year
							""",
	'CKAN_TOTAL_SBILL':		"""
								select date_part('month', issue_date) as month, date_part('year', issue_date) as year, sum(value) as total 
								from payt.simulated_bill 
								group by month,year
							""",
	'CKAN_TOTAL_PERSON':	"""
								select count(*) from payt.person
							""",
	'CKAN_TOTAL_BUSINESS':	"""
								select count(*) from payt.business
							""",
	'CKAN_CONTAINERS_INFO':	"""
								select container_id, deposit_volume, lat, long, name as waste_type
								from payt.container
								join payt.waste_type on waste_type = waste_type_id
							""",

	'INSERT_MONTH_WASTE':	"""
								insert into payt.monthly_waste
								(month_year, waste) values
								(%s, %s)
							""",

	'GET_MONTH_WASTE':		"""
								select month_year, waste
								from payt.monthly_waste
								order by month_year desc limit %s
							""",

	'GET_MONTH_HIGHEST_WASTE':	"""
									select month_year, waste
									from payt.monthly_waste
									order by waste desc limit 1
								""",

	'GET_COUNT_MONTH_WASTE_REC':	"""
										select count(id)
										from payt.monthly_waste
									""",

	'INSERT_WEEK_WASTE':	"""
								insert into payt.weekly_waste
								(week_start, week_end, waste, month_year)
								values (%s, %s, %s, %s)
							""",

	'GET_WEEK_WASTE':		"""
								select week_start, week_end, waste, month_year
								from payt.weekly_waste
								order by month_year desc limit %s
							""",

	'GET_WEEK_HIGHEST_WASTE':	"""
									select week_start, week_end, waste, month_year
									from payt.weekly_waste
									order by month_year desc, waste desc limit 1
								""",

	'INSERT_DAY_WASTE':		"""
								insert into payt.dayly_waste
								(day_date, month_year, waste)
								values (%s, %s, %s)
							""",

	'GET_DAY_WASTE':		"""
								select day_date, waste, month_year
								from payt.dayly_waste
								order by month_year desc limit %s
							""",

	'GET_DAY_HIGHEST_WASTE':	"""
									select day_date, waste, month_year
									from payt.dayly_waste
									order by month_year desc, waste desc limit 1
								""",


	'ALTER_FIELD_POLICY':	"""
								update payt.policies
								set polic = %s
								where id = %s
							""",

	'ALTER_OP':			"""
							update payt.functions
							set operation = %s
							where id = %s
						""",

	'GET_ALL_POLICIES':		"""
								select id, field, polic
								from payt.policies
							""",

	'GET_ALL_POLICIES_PAG':		"""
									select id, field, polic
									from payt.policies
									order by id
									limit %s
									offset %s
								""",

	'COUNT_POLICIES':		"""
								select count(id)
								from payt.policies
							""",

	'GET_ALL_FUNCS':		"""
								select id, func, ret, operation
								from payt.functions
							""",

	'GET_ALL_FUNCS_PAG':	"""
								select id, func, ret, operation
								from payt.functions
								order by id
								limit %s
								offset %s
							""",

	'COUNT_FUNCS':		"""
							select count(id)
							from payt.functions
						""",

	'GET_RET_POL':		"""
							select polic
							from payt.policies
							where field = %s
						""",

	'UPDATE_FIELDS':	"""
							insert into payt.policies (field)
								select concat(table_name::text,'.',column_name::text) as field_in
								from information_schema.columns
								where table_schema = 'payt' 
								ON CONFLICT (field) DO NOTHING
						""",

	'INSERT_FUNC':		"""
							insert into payt.functions (func, ret, operation)
							values (%s, %s, %s)
							ON CONFLICT (func) DO NOTHING
						""",

	'GET_ALL_FUNCS_':	"""
							select func, ret, operation
							from payt.functions
						""",

	'GET_FIELD_POLIC':	"""
							select field, polic
							from payt.policies
						""",

	'COUNT_BILL_PROD':	"""
							select count()
							from payt.real_bills
							where party = %s
						""",

	'GET_LAST_RBILL_DATE':	"""
								select period_end
								from payt.real_bill
								where party = %s
								order by period_end desc
								fetch first 1 rows only
							""",
}

for KEY in QUERIES:
	QUERIES[KEY] = QUERIES[KEY].replace('\t','').replace('\n', ' ').strip()