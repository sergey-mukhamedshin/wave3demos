(function () {
	'use strict';

	var appWidget = angular.module('trafficWidget', ['core', 'logging', 'map', 'data', 'localization']);

	platform.runApplication('trafficWidget', function () {
		appWidget.run(function (console, localization) {
			console.info('Traffic Widget version %1', Config.version);
			localization.setLocale(Config.language);
		});
	});

	appWidget.controller('WidgetCtrl',
		['$scope', '$timeout', '$element', 'core', 'map', 'dataProvider',
		function ($scope, $timeout, $element, core, map, dataProvider) {

			var errors = {
				GOOGLE_MAPS_API_NOT_LOADED: 1,
				SETTINGS_NOT_LOADED: 2,
				EMPTY_DATA: 3,
				NO_ROUTES_DEFINED: 4,
				DIRECTIONS_NOT_LOADED: 5,
				NO_DIRECTIONS: 6,
				DURATION_NOT_AVAILABLE: 7
			};

			function updateUI(durationText, lightClass) {
				angular.element(core.get('duration')).text(durationText);
				angular.element(core.get('light')).addClass(lightClass);
			}

			function showError(errorCode) {
				updateUI('N/A (' + errorCode + ')', 'hidden');
			}

			function getRouteToProcess(settings) {
				var route = settings.routes[settings.defaultRoute];
				if (route.points.length < 2) {
					for (var i = 0; i < settings.routes.length; ++i) {
						route = settings.routes[i];
						if (route.points.length > 1) break;
					}
				}
				return route;
			}

			function estimateCongestion(route) {
				var duration = route.durationInTraffic;
				var isTrafficDuration = true;

				if (!duration) {
					duration = route.duration;
					isTrafficDuration = false;
				}

				if (!duration)
					showError(errors.DURATION_NOT_AVAILABLE);
				else {
					var minutes = duration % 60;
					var formattedDuration = Math.floor(duration / 60) + ':' + (duration < 10 ? '0' : '') + minutes;

					var lightClass = '';

					if (isTrafficDuration) {
						if (route.duration) {
							var congestion = duration / route.duration;
							if (congestion <= Config.lightColor.green)
								lightClass = 'green';
							else if (congestion <= Config.lightColor.yellow)
								lightClass = 'yellow';
							else
								lightClass = 'red';
						}
						else
							lightClass = 'hidden';
					}
					updateUI(formattedDuration, lightClass);
				}
			}

			map.loadApi().then(function () {
				map.initialize();

				dataProvider.getRoutes().then(function (settings) {
					if (!settings.routes.length)
						showError(errors.EMPTY_DATA);
					else {
						var points = getRouteToProcess(settings).points;

						if (points.length < 2)
							showError(errors.NO_ROUTES_DEFINED);
						else {
							var route = [];
							for (var i = 0; i < points.length; ++i)
								route.push(map.getLocation(points[i].lat, points[i].lng));

							map.findRoutes(route).then(function (alternatives) {
								if (!alternatives.length)
									showError(errors.NO_DIRECTIONS);
								else {
									var best = map.getBestRouteIndex(alternatives);
									estimateCongestion(alternatives[best]);
								}
							}, function () {
								showError(errors.DIRECTIONS_NOT_LOADED);
							});
						}
					}
				}, function () {
					showError(errors.SETTINGS_NOT_LOADED);
				});
			}, function () {
				showError(errors.GOOGLE_MAPS_API_NOT_LOADED);
			});
		}]);
})();
