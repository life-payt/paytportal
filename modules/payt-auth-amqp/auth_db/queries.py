APPEND_END_DATE = " and collection_ts::date <= %s"
QUERIES = {
	'GET_COUNTY_ID':"""
						select id
						from authdb.counties
						where LOWER(county)=%s
					""",


	'CHECK_USER_ID':"""
						select count(user_id)
						from authdb.users
						where user_id=%s
					""",

	'CHECK_USER': 	"""
						select count(username)
						from authdb.users
						where username=%s
					""",

	'GET_USER_ID':	"""
						select authdb.users.user_id
						from authdb.users
						where username=%s
					""",

	'GET_PASSWORD':	"""
						select passhash
						from authdb.users
						where user_id=%s
					""",

	'GET_ROLE':	"""
					select authdb.roles.role
					from authdb.users
					inner join authdb.roles
					on authdb.users.role = authdb.roles.id
					where authdb.users.user_id=%s
				""",

	'GET_ALL_ROLES':	"""
							select *
							from authdb.roles
						""",
	
	'GET_COUNTY': 	"""
						select authdb.counties.county
						from authdb.counties
						inner join authdb.customers
						on authdb.counties.id = authdb.customers.county
						where authdb.customers.username=%s
					""",

	'GET_COUNTY_STAFF': """
							select authdb.counties.county 
							from authdb.counties 
							inner join authdb.countyadmins 
							on authdb.counties.id = authdb.countyadmins.county 
							where authdb.countyadmins.username = %s
						""",

	'GET_ALIAS':		"""
							select authdb.users.alias
							from authdb.users
							where authdb.users.user_id = %s
						""",

	'EDIT_ALIAS':		"""
							update authdb.users
							set alias = %s
							where user_id = %s 
						""",

	'GET_EMAIL':	"""
						select authdb.users.email
						from authdb.users
						where authdb.users.user_id=%s
					""",

	'INSERT_CUST':	"""
						insert into authdb.customers
						(username, county) values
						(%s, %s)
					""",

	'INSERT_USER':	"""
						insert into authdb.users
						(username, email, alias, role, salt, passhash, master_ph) values
						(%s, %s, %s, %s, %s, %s, %s)
					""",

	'DELETE_USR':	"""
						delete from authdb.users
						where user_id=%s
					""",

	'SET_EMAIL':	"""
						update authdb.users
						set email=%s
						where user_id=%s
					""",

	'SET_USRNAME':	"""
						update authdb.users
						set username=%s
						where user_id=%s
					""",

	'SET_ROLE':	"""
						update authdb.users
						set role=%s
						where user_id=%s
					""",

	'SET_PW':	"""
					update authdb.users
					set salt=%s, passhash=%s
					where user_id=%s
				""",
	
	'GET_ALL_COUNTIES':	"""
							select * from authdb.counties
						""",

	'COUNT_USERS':		"""
							select count(user_id)
							from authdb.users
						""",

	'COUNT_SEARCH':		"""
							select count(user_id)
							from authdb.users
							where LOWER(username) LIKE LOWER(%s) or LOWER(email) LIKE LOWER(%s)
						""",
				
	'GET_ALL_USERS':	"""
							select authdb.users.user_id, authdb.users.username, authdb.users.email, authdb.roles.role, authdb.validation_status.status, authdb.users.last_access
							from authdb.users
							inner join authdb.roles
							on authdb.users.role = authdb.roles.id
							inner join authdb.validation_status
							on authdb.users.validated = authdb.validation_status.id
						""",

	'GET_ALL_USERS_PAG':	"""
							select authdb.users.user_id, authdb.users.username, authdb.users.email, authdb.roles.role, authdb.validation_status.status, authdb.users.last_access
							from authdb.users
							inner join authdb.roles
							on authdb.users.role = authdb.roles.id
							inner join authdb.validation_status
							on authdb.users.validated = authdb.validation_status.id
							order by authdb.users.user_id
							limit %s
							offset %s
						""",

	'GET_SEARCH_USERS':	"""
							select authdb.users.user_id, authdb.users.username, authdb.users.email, authdb.roles.role, authdb.validation_status.status, authdb.users.last_access
							from authdb.users
							inner join authdb.roles
							on authdb.users.role = authdb.roles.id
							inner join authdb.validation_status
							on authdb.users.validated = authdb.validation_status.id
							where LOWER(authdb.users.username) LIKE LOWER(%s) or LOWER(authdb.users.email) LIKE LOWER(%s)
							order by authdb.users.user_id
						""",

	'GET_SEARCH_USERS_PAG':	"""
							select authdb.users.user_id, authdb.users.username, authdb.users.email, authdb.roles.role, authdb.validation_status.status, authdb.users.last_access
							from authdb.users
							inner join authdb.roles
							on authdb.users.role = authdb.roles.id
							inner join authdb.validation_status
							on authdb.users.validated = authdb.validation_status.id
							where LOWER(authdb.users.username) LIKE LOWER(%s) or LOWER(authdb.users.email) LIKE LOWER(%s)
							order by authdb.users.user_id
							limit %s
							offset %s
						""",

	'GET_USER_COUNTIES':	"""
								SELECT authdb.counties.county
								FROM authdb.counties
								inner join authdb.customers on authdb.customers.county = authdb.counties.id
								where authdb.customers.username=%s
							""",
	'GET_SALT':	"""
					select authdb.users.salt
					from authdb.users
					where authdb.users.user_id=%s
				""",

	'GET_USERNAME':	"""
						select authdb.users.username
						from authdb.users
						where authdb.users.user_id=%s
					""",
	
	'INSERT_CTY':	"""
						insert into authdb.countyadmins
						(username, county) values
						(%s, %s)					
					""",

	'GET_ADMIN_COUNTIES':	"""
								SELECT authdb.counties.county
								FROM authdb.counties
								inner join authdb.countyadmins on authdb.countyadmins.county = authdb.counties.id
								where authdb.countyadmins.username=%s
							""",

	'GET_VALIDATED':	"""
							select authdb.users.validated
							from authdb.users
							where authdb.users.user_id=%s
						""",

	'SET_VALIDATED':	"""
							update authdb.users
							set validated = 1
							where user_id=%s
						""",

	'COUNT_ROLE':	"""
						select count(role)
						from authdb.users
						where role=%s
					""",

	'GET_ALL_STATUS': 	"""
							select * from authdb.validation_status
						""",

	'EDIT_STATUS':	"""
						update authdb.validation_status
						set status = %s
						where id = %s
					""",

	'INSERT_STATUS':	"""
							insert into authdb.validation_status 
							(id, status) values
							(%s, %s)
						""",

	'DELETE_STATUS':	"""
							delete from authdb.validation_status
							where id = %s
						""",
				
	'GET_MASTER':		"""
							select master_ph from authdb.users
							where user_id = %s
						""",

	'GET_SERVICE':		"""
							select count(name)
							from authdb.services
							where name=%s
						""",

	'GET_SERVICES_NAME':	"""
								select name
								from authdb.services
							""",

	'GET_SALT_SERVICE':	"""
							select salt
							from authdb.services
							where name=%s
						""",

	'GET_SALT_PW':		"""
							select secret
							from authdb.services
							where name=%s
						""",

	'INSERT_SERVICE':	"""
							insert into authdb.services
							(name, salt, secret) values
							(%s, %s, %s)
						""",

	'GET_STATUS_USER':	"""
							select status 
							from authdb.validation_status
							inner join authdb.users on authdb.users.validated = authdb.validation_status.id
							where authdb.users.user_id = %s
						""",

	'SET_LAST_ACCESS':	"""
							update authdb.users
							set last_access = CURRENT_DATE
							where user_id = %s
						""",

	'GET_LAST_ACCESS':	"""
							select last_access
							from authdb.users
							where user_id = %s
						""",

	'SET_FORGOTTEN':	"""
							update authdb.users
							set validated = 4
							where user_id = %s
						""",

	'SET_STATUS_FCLIENT':	"""
								update authdb.users
								set validated = 3
								where user_id = %s
							""",

	'CHECK_BANNED':		"""
							select count(user_id)
							from authdb.banned_users
							where user_id = %s
						""",

	'DELETE_BAN_ENTRY':	"""
							delete from authdb.banned_users
							where user_id = %s
						""",

	'LOG_FAIL':			"""
							insert into authdb.failed_logins
							(user_id) values (%s)
						""",

	'SET_BAN':			"""
							insert into authdb.banned_users
							(user_id, ban_end) values (%s, %s)
						""",

	'COUNT_FAILED_LOGINS':	"""
								select count(user_id)
								from authdb.failed_logins
								where user_id = %s
							""",

	'GET_TIME_EXP':		"""
							select ban_end
							from authdb.banned_users
							where user_id = %s
						""",

	'ALTER_FIELD_POLICY':	"""
								update authdb.policies
								set polic = %s
								where id = %s
							""",

	'ALTER_OP':			"""
							update authdb.functions
							set operation = %s
							where id = %s
						""",

	'GET_ALL_POLICIES':		"""
								select id, field, polic
								from authdb.policies
							""",

	'GET_ALL_POLICIES_PAG':		"""
									select id, field, polic
									from authdb.policies
									order by id
									limit %s
									offset %s
								""",

	'COUNT_POLICIES':		"""
								select count(id)
								from authdb.policies
							""",

	'GET_ALL_FUNCS':		"""
								select id, func, ret, operation
								from authdb.functions
							""",

	'GET_ALL_FUNCS_PAG':	"""
								select id, func, ret, operation
								from authdb.functions
								order by id
								limit %s
								offset %s
							""",

	'COUNT_FUNCS':		"""
							select count(id)
							from authdb.functions
						""",

	'GET_RET_POL':		"""
							select polic
							from authdb.policies
							where field = %s
						""",

	'UPDATE_FIELDS':	"""
							insert into authdb.policies (field)
								select concat(table_name::text,'.',column_name::text) as field_in
								from information_schema.columns
								where table_schema = 'authdb' 
								ON CONFLICT (field) DO NOTHING
						""",

	'INSERT_FUNC':		"""
							insert into authdb.functions (func, ret, operation)
							values (%s, %s, %s)
							ON CONFLICT (func) DO NOTHING
						""",

	'GET_ALL_FUNCS_':	"""
							select func, ret, operation
							from authdb.functions
						""",

	'GET_FIELD_POLIC':	"""
							select field, polic
							from authdb.policies
						""",

}

for KEY in QUERIES:
	QUERIES[KEY] = QUERIES[KEY].replace('\t','').replace('\n', ' ').strip()