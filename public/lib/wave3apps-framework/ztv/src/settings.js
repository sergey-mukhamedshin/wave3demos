(function() { 'use strict';

	var nameSpaces = {};
	var separator = ':';
	var supported = [
		{
			get: get_localStorage,
			set: set_localStorage,
			remove: remove_localStorage
		},
		{
			get: get_config,
			set: unsupported,
			remove: unsupported
		}
	];
	var config = {};

	var NS = function(name) {
		this.name = name;
	};

	NS.prototype.get = function(key) {
		var deferred = ztv.q.defer();

		get({
			namespace: this.name,
			key: key,
			deferred: deferred
		});

		return deferred.promise;
	};

	NS.prototype.set = function(key, value) {
		var deferred = ztv.q.defer();

		set({
			namespace: this.name,
			key: key,
			value: value,
			deferred: deferred
		});

		return deferred.promise;
	};

	NS.prototype.remove = function(key) {
		var deferred = ztv.q.defer();

		remove({
			namespace: this.name,
			key: key,
			deferred: deferred
		});

		return deferred.promise;
	};

	function get(params) {
		var deferred = params.deferred;
		var i;
		var all = {};

		function tryOne(value) {
			if (value === null || typeof value == 'undefined') {
				if (++i >= supported.length)
					deferred.reject();
				else
					supported[i].get(params).then(tryOne, tryOne);
			}
			else
				deferred.resolve(value);
		}

		function tryAll(data) {
			for (var key in data)
				if (data.hasOwnProperty(key))
					all[key] = data[key];
			if (--i < 0)
				deferred.resolve(all);
			else
				supported[i].get(params).then(tryAll, tryAll);
		}


		if (typeof params.key != 'undefined') {
			i = 0;
			supported[i].get(params).then(tryOne, tryOne);
		}
		else {
			i = supported.length - 1;
			supported[i].get(params).then(tryAll, tryAll);
		}
	}
	function set(params) {
		var success = false;
		for (var i = 0; i < supported.length; ++i)
			if (supported[i].set(params))
				success = true;
		if (!success)
			params.deferred.reject();
	}
	function remove(params) {
		for (var i = 0; i < supported.length; ++i)
			supported[i].remove(params);

		params.deferred.resolve();
	}
	function unsupported() { return false; }

	/* localStorage */

	function get_localStorage(params) {
		var deferred = ztv.q.defer();

		setTimeout(function() {
			if (typeof params.key != 'undefined')
				deferred.resolve(JSON.parse(localStorage.getItem(params.namespace + separator + params.key)));
			else
				deferred.resolve(getKeysFromLocalStorage(params.namespace).reduce(function(result, key) {
					result[key] = JSON.parse(localStorage.getItem(params.namespace + separator + key));
					return result;
				}, {}));
		}, 0);

		return deferred.promise;
	}
	function set_localStorage(params) {
		setTimeout(function() {
			if (typeof params.value != 'undefined')
				localStorage.setItem(params.namespace + separator + params.key, JSON.stringify(params.value));

			params.deferred.resolve(true);
		}, 0);

		return true;
	}
	function remove_localStorage(params) {
		localStorage.removeItem(params.namespace + separator + params.key);
	}

	function getKeysFromLocalStorage(namespace) {
		var keys = [];
		for (var i = 0; i < localStorage.length; ++i) {
			var key = localStorage.key(i);
			if (key.indexOf(namespace + separator) === 0)
				keys.push(key.replace(namespace + separator, ''));
		}

		return keys;
	}

	/* config */

	function get_config(params) {
		var deferred = ztv.q.defer();

		setTimeout(function() {
			if (typeof params.key != 'undefined')
				deferred.resolve(config[params.key]);
			else {
				var all = {};
				for (var key in config)
					if (config.hasOwnProperty(key))
						all[key] = config[key];
				deferred.resolve(all);
			}
		}, 0);


		return deferred.promise;
	}

	ztv.settings = {};

	ztv.settings.init = function() {
		var deferred = ztv.q.defer();

		var _ = new XMLHttpRequest();
		_.open('GET', 'config.json', true);
		_.onreadystatechange = function() {
			if (this.readyState == 4) {
				if (this.status == 200) {
					config = JSON.parse(this.responseText);
					deferred.resolve();
				}
				else
					deferred.reject('[HTTP error]: ' + this.status);
			}
		};
		_.send();

		return deferred.promise;
  };

  ztv.settings.getNamespace = function(name) {
		if (!(name in nameSpaces)) {
			nameSpaces[name] = new NS(name);
		}

		return nameSpaces[name];
  };

	ztv.settings.clearNamespace = function(name) {
		var deferred = ztv.q.defer();
		var ns = this.getNamespace(name);
		ns.get().then(function(settings) {
			var promises = [];

			for (var key in settings)
				if (settings.hasOwnProperty(key))
					promises.push(ns.remove(key));

			ztv.q.all(promises).then(deferred.resolve.bind(deferred), deferred.reject.bind(deferred));
		});

		return deferred.promise;
  };

})();
