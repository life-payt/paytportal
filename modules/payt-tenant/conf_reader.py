import configparser

class Configs(object):
	def __init__(self, filename='tenant.cfg'):
		self.confparser = configparser.ConfigParser()
		self.configs = {}
		if self.confparser.read(filename):
			self.parse()

	def parse(self):
		self.configs = {
			"tenant_name" : self.confparser.get('TENANT INFO','TENANT_NAME'),
			"broker": {
				"host" : self.confparser.get('RABBITMQ','RABBITMQ_HOST'),
				"port" : self.confparser.getint('RABBITMQ','RABBITMQ_PORT'),
				"vhost" : self.confparser.get('RABBITMQ', 'RABBITMQ_VHOST'),
				"user" : self.confparser.get('RABBITMQ', 'RABBITMQ_USER'),
				"key"  : self.confparser.get('RABBITMQ', 'RABBITMQ_KEY')
			},
			"database": {
				"host" : self.confparser.get('DATABASE','DB_HOST'),
				"port" : self.confparser.getint('DATABASE','DB_PORT'),
				"username" : self.confparser.get('DATABASE','DB_USERNAME'),
				"password" : self.confparser.get('DATABASE','DB_PASSWORD'),
				"dbname" : self.confparser.get('DATABASE','DB_DBNAME'),
			},
			"parsers":{
				"users": self.confparser.get('PARSERS','USERS'),
				"bills": self.confparser.get('PARSERS','BILLS')
			},
			"memcached":{
				"host": self.confparser.get('MEMCACHED','MEM_HOST'),
				"port": self.confparser.get('MEMCACHED','MEM_PORT')
			}
		}
		if 'WORKER' in self.confparser._sections:
			self.configs['worker'] = dict(self.confparser._sections['WORKER'])

		if 'EXPORTER' in self.confparser._sections:
			self.configs['exporter'] = dict(self.confparser._sections['EXPORTER'])

	def get(self):
		return self.configs