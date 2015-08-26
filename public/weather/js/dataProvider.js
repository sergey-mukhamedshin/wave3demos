var fallback;
(function () {
	'use strict';

	/*global Config*/

	angular.module('dataProvider', ['logging']).service('dataProvider', ['$http', '$q', 'console', function ($http, $q, console) {
		var dataProvider = {};

		var jsonpCallback/* = arg('callback', 'JSON_CALLBACK')*/;

		function arg(key, value, encoded) {
			return key + '=' + (encoded ? value : encodeURIComponent(value));
		}

		function url(message, args) {
			var query = '';
			if (args && args.length) {
				query = '?' + args.join('&');
			}
			return Config.serverUrl + message + query;
		}

		function data(args) {
			var result;
			if (args) {
				result = args.join('&');
			}
			return result;
		}

		function request(method, message, args, post) {
			var deferred = $q.defer();

			var config = {
				method: method,
				url: url(message, args),
				data: data(post),
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
			};

			console.info('REQUESTING: [method=%1, url=%2, data=%3]', method, config.url, config.data);
			$http(config)
				.success(
					function (data) {
						console.info('SUCCESS: [method=%1, url=%2, data=%3]', method, config.url, config.data);

						//DEBUG: fake data if fallback is enabled
						if (fallback && fallback[message]) {
							deferred.resolve(fallback[message]);
						}
						else {
							deferred.resolve(data);
						}
					}
				)
				.error(
					function (data) {
						console.warn('FAILURE: [method=%1, url=%2, data=%3]', method, config.url, config.data);

						//DEBUG: fake data if fallback is enabled
						if (fallback && fallback[message]) {
							deferred.resolve(fallback[message]);
						}
						else {
							deferred.reject(data);
						}
					}
				);

			return deferred.promise;
		}

		function post(message, args, data) {
			return request('POST', message, args, data);
		}

		function get(message, args) {
			var method = 'GET';
			if (jsonpCallback) {
				args = args ? args.concat(jsonpCallback) : [jsonpCallback];
				method = 'JSONP';
			}
			return request(method, message, args, null);
		}

		dataProvider.locationwise = function (locations) {
			var args = [];
			for (var i = 0; i < locations.length; ++i) {
				args.push(arg('location', locations[i].id));
			}
			return get('locationwise', args);
		};

		dataProvider.weekly = function (location) {
			var args = [arg('location', location)];
			return get('weekly', args);
		};

		dataProvider.hourly = function (location, date) {
			return get('hourly', [arg('location', location), arg('date', date)]);
		};

		dataProvider.currentLocation = function () {
			return get('currentLocation', null);
		};

		dataProvider.locationSuggestions = function (search, type) {
			return get('locationSuggestions', [arg('search', search), arg('type', type)]);
		};

		dataProvider.myLocations = function () {
			return get('myLocations', null);
		};

		dataProvider.saveLocations = function (mylocations) {
			var data = [];
			for (var i = 0; i < mylocations.locations.length; ++i) {
				data.push(arg('id', mylocations.locations[i].id, true));
				data.push(arg('name', mylocations.locations[i].name, true));
			}

			if (mylocations.defaultLocation !== null) {
				data.push(arg('defaultLocation', mylocations.defaultLocation));
			}
			return post('saveLocations', null, data);
		};

		dataProvider.settings = function () {
			return get('settings', null);
		};

		dataProvider.saveSettings = function (settings) {
			var data = [
				arg('defaultView', settings.defaultView, true),
				arg('temperature', settings.temperature, true),
				arg('time', settings.time, true),
				arg('alerts', settings.alerts, true),
				arg('windSpeed', settings.windSpeed, true),
			];

			return post('saveSettings', null, data);
		};

		//Contstants
		dataProvider.SUGGESTION_LOCATION = 0;

		dataProvider.CELSIUS = 0;
		dataProvider.FAHRENHEIT = 1;

		dataProvider.AMPM = 0;
		dataProvider.HOURS24 = 1;

		dataProvider.NOALERTS = 0;
		dataProvider.ALERTS = 1;

		return dataProvider;
	}]);
})();
