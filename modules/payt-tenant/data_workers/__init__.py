import pkgutil
import inspect

w = {}

for loader, name, is_pkg in pkgutil.walk_packages(__path__):
	module = loader.find_module(name).load_module(name)

	for name, value in inspect.getmembers(module):
		if name.startswith('__') or not inspect.isclass(value):
			continue

		globals()[name] = value
		w[name] = value