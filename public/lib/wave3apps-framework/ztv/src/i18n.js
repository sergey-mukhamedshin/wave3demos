(function() {
	var LOCALES_PATH = 'locales';

	/* PUBLIC */

	ztv.i18n = {};

	ztv.i18n.get = function(constant, options) {
		return get(constant, options);
	};

	ztv.i18n.getMessage = function(constant, options) {
		return get(constant, options).message;
	};

	ztv.i18n.loadLocale = function(locale) {
		messages = [];

		var promises = [];
		for (var i = 0; i < resources.length; ++i)
			promises.push(loadResource([LOCALES_PATH, locale, resources[i]].join('/')));

		return ztv.q.all(promises);
	};

	ztv.i18n.useResources = function(paths) {
		resources = typeof paths == 'string' ? [paths] : paths;
	};

	/* PRIVATE */

	var messages = [];
	var resources = [];

	function loadResource(path) {
		var deferred = ztv.q.defer();

		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					xhr.onreadystatechange = null;

					var data = JSON.parse(xhr.responseText);

					if (data && data.messages)
						messages = messages.concat(data.messages);
				}
				else
					ztv.console.error('Cannot load ' + path);

				deferred.resolve();
			}
		};
		xhr.open('GET', path, false);
		xhr.send(null);

		return deferred.promise;
	}

	function get(constant, options) {
		for (var i = 0; i < messages.length; ++i)
			if (messages[i].const == constant)
				return {
					id: messages[i].id,
					const: constant,
					message: parseString(messages[i].message, options),
					description: parseString(messages[i].description, options)
				};

		ztv.console.warn('Message for %s not found', constant);
		return {
			id: '',
			const: constant,
			message: constant,
			description: ''
		};
	}

	function parseString(str, options) {
		return options ? str.replace(/\{\{\s*(.+?)\s*\}\}/gm, function(template, variable) {
			var path = variable.split('.');
			var value = options;

			for (var i = 0; i < path.length; ++i)
				if (typeof value == 'undefined')
					break;
				else
					value = value[path[i]];

			return value;
		}) : str;
	}
})();
