import requests
import asyncio
import aiopg
import logging
import os
from requests.exceptions import HTTPError

global logger
logger = logging.getLogger('auth.api')

class Apifuncs:
    def __init__(self):
        pass

    #TODO
    async def login(self, username, password):
        response = requests.post("http://172.17.0.1:3000/api/users/login", {"username":username, "password":password})
        return 'login'

    #TODO
    async def getUsers(self):
        response = requests.get("http://172.17.0.1:3000/api/users")
        return 'getUsers'

    #TODO
    async def resetPassword(self, usermail):
        #response = requests.put()
        return 1

    async def insertUser(self, username, password, email, county):
        d = {"realm": county, "username": username, "password":password, "email": email, "emailVerified": "true"}
        try:
            inserted = requests.post("http://172.17.0.1:3000/api/users", data=d)
        except HTTPError as http_err:
            logger.debug(http_err)
            return -1
        except Exception as err:
            logger.debug(err)
            return -1
        else:
            if inserted.status_code == 200:
                newid = inserted.json()["id"]
            else:
                return -1

        return newid

    #TODO
    async def delete_user(self, uid):
        response = requests.delete("http://localhost:3000/api/users/"+uid+"?access_token="+token)