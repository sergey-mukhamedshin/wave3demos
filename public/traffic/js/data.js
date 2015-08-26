(function () {
	'use strict';

	angular.module('data', []).service('dataProvider', ['$http', '$q', 'console', function ($http, $q, console) {
		function query(message, method, params, fallbackResponse) {
			var deferred = $q.defer();

			var request = {
				url: Config.serverUrl + message,
				method: method,
				headers: {
					'Accept': 'application/json'
				}
			};

			if (method == 'POST') {
				request.headers['Content-Type'] = 'application/json';
				request.data = params;
			} else {
				request.params = params;
			}

			console.info('sending %1 request...', message);

			$http(request)
				.success(function (data, status, headers, config) {
					console.info('request %1 successfully processed: %2', message, angular.toJson(data));
					deferred.resolve(data);
				})
				.error(function (data, status, headers, config) {
					console.warn('request %1 failed with status %2', message, status);
					if (typeof (fallbackResponse) == 'undefined')
						deferred.reject(status);
					else
						deferred.resolve(fallbackResponse);
				});

			return deferred.promise;
		}

		return {
			getRoutes: function () {
				return query('myRoutes', 'GET', null, {
					routes: [
						//{ name: "Location1", icon: 1, points: [{ lat: 43.681894, lng: -79.483938 }] },
						//{ name: "Location2", icon: 2, points: [{ lat: 43.681894, lng: -79.483738 }] },
						//{ name: "Location3", icon: 3, points: [{ lat: 43.681894, lng: -79.483738 }] },
						//{ name: "Apple Store", icon: 13, points: [{ lat: 43.600781, lng: -79.643433 }, { lat: 43.691894, lng: -79.383738 }] },
						//{"name":"Store","icon":13,"points":[{"lat":43.485135192719596,"lng":-79.34229212700194}]},
						//{ name: "School", icon: 3, points: [{ lat: 43.600781, lng: -79.643433 }, { lat: 43.600781, lng: -79.643433 }] },
						//{ name: "Shopping", icon: 8, points: [{ lat:43.653466, lng: -80.012162 } ] },
						//{ name: "Mummy", icon: 11, points: [{ lat: 43.14183, lng: -80.263909 }] }
					],
					defaultRoute: 0
				});
			},

			saveRoutes: function (routes) {
				return query('saveRoutes', 'POST', routes/*, {}*/);
			},

			getClientPostalCode: function () {
				return 'M9R 3C8'; // TBD
			},

			getClientLocationByIp: function () {
				var deferred = $q.defer();

				var request = {
					url: 'http://freegeoip.net/json/',
					method: 'GET',
					headers: {
						'Accept': 'application/json'
					}
				};

				console.info('looking up address by IP...');

				$http(request)
					.success(function (data, status, headers, config) {
						console.info('address lookup by IP: %1', angular.toJson(data));
						deferred.resolve({ lat: data.latitude, lng: data.longitude });
					})
					.error(function (data, status, headers, config) {
						console.warn('failed to look up address by IP: %1', status);
						deferred.reject(status);
					});

				return deferred.promise;
			}
		};
	}]);
})();
