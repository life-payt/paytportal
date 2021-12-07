import hashlib
import binascii
import os
import asyncio
import aiopg
import logging

class Cryptohash:
	def __init__(self):
		pass

	async def doHash(self, pwd):
		#logger.debug('Doing hash with newly generated salt.')
		salt_hex = os.urandom(64)
		hex_got = hashlib.pbkdf2_hmac('sha512', pwd.encode(), salt_hex, 10000)
		pwdhash = binascii.hexlify(hex_got).decode()
		salt = binascii.hexlify(salt_hex).decode()
		return salt, pwdhash

	async def doHashSalt(self, pwd, salt):
		#logger.debug('Doing hash with pre selected salt.')
		hex_got = hashlib.pbkdf2_hmac('sha512', pwd.encode(), binascii.unhexlify(salt), 10000)
		pwdhash = binascii.hexlify(hex_got).decode()
		return pwdhash

	async def comparePW(self, salt, pwd, realpwd):
		#logger.debug('Comparing sent password with real value.')
		hex_got = hashlib.pbkdf2_hmac('sha512', pwd.encode(), binascii.unhexlify(salt), 10000)
		pwdhash = binascii.hexlify(hex_got).decode()
		if pwdhash == realpwd:
			return 1
		else:
			return 0
