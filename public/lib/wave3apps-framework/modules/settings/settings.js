/**
 * Settings provides a store to keep an application data.
 */
(function() {
	'use strict';
	var separator = ':';
	var supported = [
		{
			get: get_server,
			set: unsupported,
			remove: unsupported
		},
		/*{
			get: get_file,
			set: set_file,
			remove: remove_file
		},*/
		{
			get: get_localStorage,
			set: set_localStorage,
			remove: remove_localStorage
		}, {
			get: get_config,
			set: unsupported,
			remove: unsupported
		}
	];

	angular.module('settings', ['config'])
	.factory('settingService', ['$q', '$http', 'config', 'loadConfig', function($q, $http, config, loadConfig) {
		return function(namespace) {
			namespace = namespace || '';
			return {
				get: function(key) {
					var deferred = $q.defer();

					get({
						namespace: namespace,
						key: key,
						deferred: deferred,
						$q: $q,
						$http: $http,
						config: config,
						loadConfig: loadConfig
					});

					return deferred.promise;
				},
				set: function(key, value) {
					var deferred = $q.defer();

					set({
						namespace: namespace,
						key: key,
						value: value,
						deferred: deferred,
						$http: $http,
						config: config,
						loadConfig: loadConfig
					});

					return deferred.promise;
				},
				remove: function(key) {
					var deferred = $q.defer();

					remove({
						namespace: namespace,
						key: key,
						deferred: deferred,
						$http: $http,
						config: config,
						loadConfig: loadConfig
					});

					return deferred.promise;
				},
				clear: function() {
					return this.remove(getKeysFromLocalStorage(namespace));
				}
			};
		};
	}]);

	/* proxy methods */

	function get(params) {
		var deferred = params.deferred;
		var i = 0;
		var all = {};

		function tryOne(value) {
			if (value === null || typeof value == 'undefined') {
				i++;
				if (i >= supported.length)
					deferred.reject();
				else
					supported[i].get(params).then(tryOne, tryOne);
			}
			else
				deferred.resolve(value);
		}

		function tryAll(data) {
			angular.extend(all, data);
			i--;
			if (i < 0)
				deferred.resolve(all);
			else
				supported[i].get(params).then(tryAll, tryAll);
		}

		if (typeof params.key != 'undefined')
			supported[i].get(params).then(tryOne, tryOne);
		else {
			i = supported.length - 1;
			supported[i].get(params).then(tryAll, tryAll);
		}
	}
	function set(params) {
		for (var i = 0; i < supported.length; ++i)
			if (supported[i].set(params))
				return;
		params.deferred.reject();
	}
	function remove(params) {
		for (var i = 0; i < supported.length; ++i)
			supported[i].remove(params);

		params.deferred.resolve();
	}
	function unsupported() { return false; }

	/* server */

	function get_server(params) {
		var deferred = params.$q.defer();

		if (params.namespace != 'weather' || params.key == 'serverURL')
			setTimeout(function() {
				deferred.reject();
			}, 0);
		else {
			var def = params.$q.defer();

			get({
				namespace: params.namespace,
				key: 'serverURL',
				deferred: def,
				$q: params.$q,
				$http: params.$http,
				config: params.config,
				loadConfig: params.loadConfig
			});

			def.promise.then(function(serverURL) {
				params.$http.get(serverURL + 'settings').then(function(res) {
					set_localStorage({
						namespace: params.namespace,
						key: res.data,
						deferred: {
							resolve: angular.noop
						}
					});

					return params.$http.get(serverURL + 'myLocations');
				}).then(function(res) {
					set_localStorage({
						namespace: params.namespace,
						key: 'defaultLocation',
						value: res.data.location || res.data.locations[res.data.defaultLocation],
						deferred: {
							resolve: angular.noop
						}
					});

					deferred.resolve(JSON.parse(localStorage.getItem(params.namespace + separator + params.key)));
				});
			});
		}

		return deferred.promise;
	}

	/* localStorage */

	function get_localStorage(params) {
		var deferred = params.$q.defer();

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
			else
				angular.forEach(params.key, function(v, k) {
					localStorage.setItem(params.namespace + separator + k, JSON.stringify(v));
				});

			checkNamespaces(params.namespace);
			params.deferred.resolve(true);
		}, 0);

		return true;
	}
	function remove_localStorage(params) {
		if (angular.isArray(params.key))
			angular.forEach(params.key, function(k) {
				localStorage.removeItem(params.namespace + separator + k);
			});
		else
			localStorage.removeItem(params.namespace + separator + params.key);

		checkNamespaces(params.namespace);
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
	function checkNamespaces(namespace) {
		var nsArray = JSON.parse(localStorage.getItem('namespaces')) || [];
		var index = nsArray.indexOf(namespace);

		if (index == -1) {
			nsArray.push(namespace);
			localStorage.setItem('namespaces', JSON.stringify(nsArray));
		}
		else {
			if (getKeysFromLocalStorage(namespace).length > 0)
				return;

			nsArray.splice(index, 1);
			if (nsArray.length > 0)
				localStorage.setItem('namespaces', JSON.stringify(nsArray));
			else
				localStorage.removeItem('namespaces');
		}
	}

	/* config */

	function get_config(params) {
		var deferred = params.$q.defer();

		params.loadConfig.then(function() {
			var ns = params.namespace ? params.config.apps[params.namespace] : params.config;
			if (typeof params.key != 'undefined')
				deferred.resolve(ns[params.key]);
			else
				deferred.resolve(ns);
		});

		return deferred.promise;
	}
})();