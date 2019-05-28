import xlsxwriter
import locale
import aiohttp
import logging
import asyncio
import time
import datetime as dt
import pandas as pd
from dateutil.relativedelta import relativedelta
import os
from ckanapi import RemoteCKAN, NotAuthorized, NotFound, ValidationError

try:
	import ujson as json
except:
	import json

def setup_logger(name):
	global logger
	logger = logging.getLogger(name+'.exporter')

class e_ckan(object):
	def __init__(self, *args, **kwargs):
		self._name = kwargs.get('e_name', None)
		setup_logger(self._name)
		self._county = kwargs.get('e_county', None)
		self._refresh_every= 300

		# CKAN API
		self._url_ckan = kwargs.get('url_ckan', None)
		self._api_key = kwargs.get('api_key', None)
		self._mysite = RemoteCKAN(self._url_ckan, apikey=self._api_key, user_agent='CKAN Exporter')
		self._org = 'cm-' + self._county
		self._license = 'cc-zero'
		self._username = 'gis' + self._county
		self._user = self._mysite.action.user_show(id=self._username)
		self._author = self._user['display_name']
		self._author_email = self._user['email']

	async def run(self, db):
		logger.debug('Starting CKAN data exporter..')
		while True:
			await self._exportTotalBills(db)
			await self._exportTotalUsers(db)
			await self._exportContainersInfo(db)
			logger.info('Data exported! Waiting %s seconds until next Synchronization.'%(self._refresh_every))
			await asyncio.sleep(self._refresh_every)

	async def _exportTotalBills(self, db):
		res_real = await db.ckan_total_rbill()
		res_simulated = await db.ckan_total_sbill()
		self.create_file_total_bills(res_real, res_simulated, 'total-faturas.xlsx')
		self.exportTotalBills()

	async def _exportTotalUsers(self, db):
		res_person = await db.ckan_total_person()
		res_business = await db.ckan_total_business()
		self.create_file_total_users(res_person, res_business, 'total-utilizadores.xlsx')
		self.exportTotalUsers()

	async def _exportContainersInfo(self, db):
		res_containers = await db.ckan_containers_info()
		self.create_file_containers_info(res_containers, 'contentores-info.xlsx')
		self.exportContainersInfo()

	def create_file_total_bills(self, data_real, data_simulated, filename):
		locale.setlocale(locale.LC_ALL, 'pt_PT.UTF-8')
		
		workbook = xlsxwriter.Workbook('/tmp/%s' %(filename))
		worksheet = workbook.add_worksheet()

		header = workbook.add_format({'bold': 1, 'align': 'center'})

		worksheet.set_column(0, 3, 15)

		money_format = workbook.add_format({'num_format': '# €', 'align': 'center'})
		align_center = workbook.add_format({'align': 'center'})

		worksheet.write('A1', 'Mês', header)
		worksheet.write('B1', 'Ano', header)
		worksheet.write('C1', 'Valor Real', header)
		worksheet.write('D1', 'Valor Simulado', header)

		row = 1
		col = 0

		if data_real != None:
			for idx in range(0,len(data_real)):
				month = data_real[idx]['month']
				year = data_real[idx]['year']
				rvalue = data_real[idx]['value']
				svalue = 'n/d'
				
				if data_simulated != None:
					if len(data_simulated) < idx:
						svalue = data_simulated[idx]['value']
				
				worksheet.write(row, col, month, align_center)
				worksheet.write(row, col + 1, year, align_center)
				worksheet.write(row, col + 2, rvalue, money_format)
				worksheet.write(row, col + 3, svalue, money_format)
				row += 1

		workbook.close()

	def create_file_containers_info(self, data_containers, filename):
		locale.setlocale(locale.LC_ALL, 'pt_PT.UTF-8')
		
		workbook = xlsxwriter.Workbook('/tmp/%s' %(filename))
		worksheet = workbook.add_worksheet()

		header = workbook.add_format({'bold': 1, 'align': 'center'})

		worksheet.set_column(0, 4, 20)

		quantity_format = workbook.add_format({'num_format': '# L', 'align': 'center'})
		align_center = workbook.add_format({'align': 'center'})

		worksheet.write('A1', 'Contentor #', header)
		worksheet.write('B1', 'Volume de depósito', header)
		worksheet.write('C1', 'Latitude', header)
		worksheet.write('D1', 'Longitude', header)
		worksheet.write('E1', 'Tipo de resíduos', header)

		row = 1
		col = 0

		for idx in range(0,len(data_containers)):
			c_id = data_containers[idx]['container_id']
			c_deposit_volume = data_containers[idx]['deposit_volume']
			c_lat = data_containers[idx]['lat']
			c_long = data_containers[idx]['long']
			c_waste_type = data_containers[idx]['waste_type']
			
			worksheet.write(row, col, c_id, align_center)
			worksheet.write(row, col + 1, c_deposit_volume, quantity_format)
			worksheet.write(row, col + 2, c_lat, align_center)
			worksheet.write(row, col + 3, c_long, align_center)
			worksheet.write(row, col + 4, c_waste_type, align_center)
			row += 1

		workbook.close()

	def create_file_total_users(self, data_person, data_business, filename):
		locale.setlocale(locale.LC_ALL, 'pt_PT.UTF-8')
		
		workbook = xlsxwriter.Workbook('/tmp/%s' %(filename))
		worksheet = workbook.add_worksheet()
		header = workbook.add_format({'bold': 1, 'align': 'center'})
		worksheet.set_column(0, 2, 15)
		align_center = workbook.add_format({'align': 'center'})

		worksheet.write('A1', 'Domésticos', header)
		worksheet.write('B1', 'Não Domésticos', header)
		worksheet.write('C1', 'Total', header)

		# DATA
		total = data_person + data_business
		worksheet.write('A2', data_person, align_center)
		worksheet.write('B2', data_business, align_center)
		worksheet.write('C2', total, align_center)

		workbook.close()
	
	def exportTotalBills(self):
		dataset = 'total-faturas'
		title = 'Total de faturas reais/simuladas'

		try:
			self._mysite.action.package_create(name=dataset, title=title, author=self._author, author_email=self._author_email, license_id=self._license, owner_org=self._org)
		except ValidationError:
			print('package already exists')
			pass

		fpath_xls = '/tmp/total-faturas.xlsx'
		fpath_csv = '/tmp/total-faturas.csv'
		fpath_json = '/tmp/total-faturas.json'

		data_xls = pd.read_excel(fpath_xls)
		data_xls.to_csv(fpath_csv, encoding='utf-8', index=False)
		data_xls.to_json(path_or_buf=fpath_json, orient='table')

		try:
			pkg = self._mysite.action.package_show(id=dataset)
			if(len(pkg['resources']) > 0):
				id_xls = pkg['resources'][0]['id']
				id_csv = pkg['resources'][1]['id']
				id_json = pkg['resources'][2]['id']
				exists = True
			else:
				exists = False
		except Exception:
			pass

		try:
			if(not exists):
				res_xls = self._mysite.action.resource_create(package_id=dataset, name='total-faturas.xlsx', format='xlsx', upload=open(fpath_xls, 'rb'))
				res_csv = self._mysite.action.resource_create(package_id=dataset, name='total-faturas.csv', format='csv', upload=open(fpath_csv, 'rb'))
				res_json = self._mysite.action.resource_create(package_id=dataset, name='total-faturas.json', format='json', upload=open(fpath_json, 'rb'))
			else:
				res_xls = self._mysite.action.resource_update(id=id_xls, upload=open(fpath_xls, 'rb'))
				res_csv = self._mysite.action.resource_update(id=id_csv, upload=open(fpath_csv, 'rb'))
				res_json = self._mysite.action.resource_update(id=id_json, upload=open(fpath_json, 'rb'))

			os.remove(fpath_xls)
			os.remove(fpath_csv)
			os.remove(fpath_json)
		except Exception:
			pass

	def exportTotalUsers(self):
		dataset = 'total-utilizadores'
		title = 'Total de utilizadores domésticos/não domésticos)'

		try:
			self._mysite.action.package_create(name=dataset, title=title, author=self._author, author_email=self._author_email, license_id=self._license, owner_org=self._org)
		except ValidationError:
			print('package already exists')
			pass

		fpath_xls = '/tmp/total-utilizadores.xlsx'
		fpath_csv = '/tmp/total-utilizadores.csv'
		fpath_json = '/tmp/total-utilizadores.json'

		data_xls = pd.read_excel(fpath_xls)
		data_xls.to_csv(fpath_csv, encoding='utf-8', index=False)
		data_xls.to_json(path_or_buf=fpath_json, orient='table')

		try:
			fname = 'total-utilizadores-'+dt.datetime.strftime(dt.datetime.now(),'%m-%y')
			res_xls = self._mysite.action.resource_create(package_id=dataset, name=fname+'.xlsx', format='xlsx', upload=open(fpath_xls, 'rb'))
			res_csv = self._mysite.action.resource_create(package_id=dataset, name=fname+'.csv', format='csv', upload=open(fpath_csv, 'rb'))
			res_json = self._mysite.action.resource_create(package_id=dataset, name=fname+'.json', format='json', upload=open(fpath_json, 'rb'))

			os.remove(fpath_xls)
			os.remove(fpath_csv)
			os.remove(fpath_json)
		except Exception:
			pass

	def exportContainersInfo(self):
		dataset = 'contentores-info'
		title = 'Informação sobre os contentores'

		try:
			self._mysite.action.package_create(name=dataset, title=title, author=self._author, author_email=self._author_email, license_id=self._license, owner_org=self._org)
		except ValidationError:
			print('package already exists')
			pass

		fpath_xls = '/tmp/contentores-info.xlsx'
		fpath_csv = '/tmp/contentores-info.csv'
		fpath_json = '/tmp/contentores-info.json'

		data_xls = pd.read_excel(fpath_xls)
		data_xls.to_csv(fpath_csv, encoding='utf-8', index=False)
		data_xls.to_json(path_or_buf=fpath_json, orient='table')

		try:
			pkg = self._mysite.action.package_show(id=dataset)
			if(len(pkg['resources']) > 0):
				id_xls = pkg['resources'][0]['id']
				id_csv = pkg['resources'][1]['id']
				id_json = pkg['resources'][2]['id']
				exists = True
			else:
				exists = False
		except Exception:
			pass

		try:
			if(not exists):
				res_xls = self._mysite.action.resource_create(package_id=dataset, name='contentores-info.xlsx', format='xlsx', upload=open(fpath_xls, 'rb'))
				res_csv = self._mysite.action.resource_create(package_id=dataset, name='contentores-info.csv', format='csv', upload=open(fpath_csv, 'rb'))
				res_json = self._mysite.action.resource_create(package_id=dataset, name='contentores-info.json', format='json', upload=open(fpath_json, 'rb'))
			else:
				res_xls = self._mysite.action.resource_update(id=id_xls, upload=open(fpath_xls, 'rb'))
				res_csv = self._mysite.action.resource_update(id=id_csv, upload=open(fpath_csv, 'rb'))
				res_json = self._mysite.action.resource_update(id=id_json, upload=open(fpath_json, 'rb'))

			os.remove(fpath_xls)
			os.remove(fpath_csv)
			os.remove(fpath_json)
		except Exception:
			pass
	