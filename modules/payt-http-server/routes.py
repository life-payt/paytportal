import os 
from views import index, upload

BASE_DIR = os.path.dirname(os.path.realpath(__file__))

def setup_routes(app):
	app.router.add_static('/public/', path=str(BASE_DIR + '/public'), name='public')
	app.router.add_get('/{tail:.*}', index)
	app.router.add_post('/upload/{resource}', upload)