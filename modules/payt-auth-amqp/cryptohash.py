import hashlib
import binascii
import os
import asyncio
import aiopg

def setup_logger(name):
	global logger
	logger = logging.getLogger('%s.%s'%(name,__name__.split('.')[1]))

class Cryptohash:
	def __init__(self):
		pass

	async def doHash(self, pwd):
		salt_hex = os.urandom(64)
		hex_got = hashlib.pbkdf2_hmac('sha512', pwd.encode(), salt_hex, 10000)
		pwdhash = binascii.hexlify(hex_got).decode()
		salt = binascii.hexlify(salt_hex).decode()
		return salt, pwdhash

	async def doHashSalt(self, pwd, salt):
		hex_got = hashlib.pbkdf2_hmac('sha512', pwd.encode(), salt.encode(), 10000)
		pwdhash = binascii.hexlify(hex_got).decode()
		return pwdhash


	async def comparePW(self, salt, pwd, realpwd):
		hex_got = hashlib.pbkdf2_hmac('sha512', pwd.encode(), binascii.unhexlify(salt), 10000)
		pwdhash = binascii.hexlify(hex_got).decode()

		if pwdhash == realpwd:
			return 1
		else:
			return 0
