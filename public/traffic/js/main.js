(function () {
	'use strict';

	angular.module('traffic').controller('MainCtrl',
		['$scope', '$timeout', '$interval', '$filter', '$element', '$window', 'core', 'keyboard', 'focusable', 'controls', 'task', 'map', 'localization', 'dataProvider', 'console',
		function ($scope, $timeout, $interval, $filter, $element, $window, core, keyboard, focusable, controls, task, map, localization, dataProvider, console) {
			var fdate = $filter('date');
			var welcomeOverlay = core.get('welcome');
			var mapControls = core.get('map-controls');
			var zoomIndicator = core.get('zoom-state');
			var mapContainer = core.get('map');
			var offsides = core.get('offsides');
			var offsidesStyle = getComputedStyle(offsides);
			var offsidesTop = parseInt(offsidesStyle.top);
			var offsidesWidth = parseInt(offsidesStyle.width);
			var offsidesHeight = parseInt(offsidesStyle.height);
			var mapStyle = getComputedStyle(mapContainer);
			var mapWidth = parseInt(mapStyle.width);
			var mapHeight = parseInt(mapStyle.height);
			var markerStyle = getComputedStyle(core.get('marker-proto')); 
			var markerSize = parseInt(markerStyle.width);
			var offsideStyle = getComputedStyle(core.get('offside-proto'));
			var offsideIconSize = parseInt(offsideStyle.width);

			$scope.maxDestinations = 4;
			$scope.routes = [];
			$scope.conditionTexts =
			{
				'unknown': localization.localize('CONDITION_UNKNOWN'),
				'good': localization.localize('CONDITION_GOOD'),
				'busy': localization.localize('CONDITION_BUSY'),
				'slow': localization.localize('CONDITION_SLOW'),
				'delays': localization.localize('CONDITION_DELAYS'),
			};

			var iconMap = ['', 'work', 'work2', 'school', 'food', 'gym', 'star', 'heart', 'shopping', 'school2', 'health', 'family', 'park', 'store', 'travel'];

			core.registerController('MainCtrl', function () {});

			function initialize() {
				$interval(function () {
					var date = new Date();
					$scope.currentTime = localization.localize(fdate(date, 'EEEE').toUpperCase()) + ' ' +
						localization.localize(fdate(date, 'MMMM').toUpperCase()) + ' ' + fdate(date, 'd') + ' ' +
						fdate(date, 'h:mm') + localization.localize(fdate(date, 'a').toUpperCase());
					
				}, 1000);

				controls.showMessage(localization.localize('MESSAGE_LOADING'));

				map.loadApi().then(
					function () {
						map.initialize(mapContainer, onZoomChanged, onBoundsChanged);
						createHomeMap();
					},
					function () {
						controls.hideMessage();
						controls.showPopup({
							message: localization.localize('ERROR_INITIALIZING_MAP'),
							buttons: [{ text: localization.localize('BUTTON_QUIT'), handler: core.quit }]
						});
					}
				);
			}

			function onHomeError() {
				controls.hideMessage();
				controls.showPopup({
					message: localization.localize('ERROR_INITIALIZING_MAP'),
					buttons: [{ text: localization.localize('BUTTON_QUIT'), handler: core.quit }]
				});
			}

			function onHomeReady(location) {
				$scope.homeLocation = location;
				$scope.homeMarker = map.addMarker($scope.homeLocation, 'img/markers/home.png', markerSize);
				map.setCenter($scope.homeLocation);

				dataProvider.getRoutes().then(
					function (data) {
						var routes = parseServerData(data);
						prepareRoutes(routes, onRoutesReady);
					},
					function () {
						controls.hideMessage();
						controls.showPopup({
							message: localization.localize('ERROR_LOADING_ROUTES'),
							buttons: [{ text: localization.localize('BUTTON_OK'), handler: core.quit }]
						});
					}
				);

			}

			function createHomeMap() {
				/*
				if (Config.detectClientLocationByIp) {
					dataProvider.getClientLocationByIp().then(function (location) {
						onHomeReady(map.getLocation(location.lat, location.lng));
					},
					onHomeError
				}
				else */{
					var postalCode = dataProvider.getClientPostalCode();
					if (postalCode) {
						map.geocode(postalCode).then(
							function (suggestions) {
								if (suggestions.length)
									onHomeReady(suggestions[0].location);
								else
									onHomeError();
							},
							onHomeError
						);
					}
					else
						onHomeError();
				}
			}

			function clearMap() {
				//$window.clearInterval(updateInterval);
				task.ignore('findRoutes');
			}

			function estimateCongestion(directions) {
				console.log('estimating congestion...');

				var conditions = 'unknown';

				//for demo only
				var factor = 1 + 0.9 * Math.random();
				directions.durationInTraffic = directions.duration * factor;

				if (!directions.distance || !directions.duration || !directions.durationInTraffic)
					return conditions;

				var distanceGroup;
				if (directions.distance < 10)
					distanceGroup = Config.trafficConditions.below10km;
				else if (directions.distance < 50)
					distanceGroup = Config.trafficConditions.from10to50km;
				else if (directions.distance < 100)
					distanceGroup = Config.trafficConditions.from50to100km;
				else
					distanceGroup = Config.trafficConditions.above100km;

				var congestion = directions.durationInTraffic / directions.duration;
				if (congestion < distanceGroup.good)
					conditions = 'good';
				else if (congestion < distanceGroup.busy)
					conditions = 'busy';
				else if (congestion < distanceGroup.slow)
					conditions = 'slow';
				else
					conditions = 'delays';

				return conditions;
			}

			function addOffsideIcon(route, side, x, y) {
				var img = new Image();
				img.src = 'img/markers/' + route.icon + '-' + route.conditions + '-' + side + '.png';
				img.className = 'offsideMarker';
				img.style.left = x + 'px';
				img.style.top = y + 'px';
				offsides.appendChild(img);
			}

			function onRoutesReady(routes) {
				controls.hideMessage();
				$scope.routes = routes;
				//console.dir(routes);
				core.callController($scope.routes.length ? 'DestinationsCtrl' : 'WelcomeCtrl');
			}

			function addMarker(route) {
				var markerIcon = 'img/markers/' + route.icon + '-' + route.conditions + '.png'
				var marker = map.addMarker(route.points[route.points.length - 1], markerIcon, markerSize);
				route.marker = marker;
			};

			function prepareRoute(route, success, error) {
				map.findRoutes([$scope.homeLocation, route.points[route.points.length - 1]]).then(
					function (alternatives) {
						if (!alternatives.length) {
							route.conditions = 'unknown';
							error(route);
						}
						else {
							var best = map.getBestRouteIndex(alternatives);
							route.conditions = estimateCongestion(alternatives[best]);
							success(route);
						}
					},
					function() {
						error(route);
					}
				);
			}

			function prepareRoutes(routes, ready) {
				var index = 0;
				if (routes && routes.length)
					prepareRoute(routes[index], success, error);
				else
					ready(routes);

				function error(route) {
					controls.hideMessage();
					controls.showPopup({
						message: localization.localize('ERROR_LOADING_DIRECTIONS').replace("%s", route.name),
						buttons: [{
							text: localization.localize('BUTTON_OK'), handler: function() {	success(route);	}
						}]
					});
				}

				function success(route) {
					addMarker(route);
					index++;
					if (index < routes.length) {
						prepareRoute(routes[index], success, error);
					}
					else {
						if (ready)
							ready(routes);
					}
				}
			}

			function onZoomChanged(zoomLevel) {
				zoomIndicator.className = 'zoom-' + zoomLevel;
			}

			function onBoundsChanged() {
				offsides.innerHTML = '';
				for (var r in $scope.routes) {
					var route = $scope.routes[r];
					var destination = route.points[route.points.length - 1];
					var p = map.fromLatLngToContainerPixel(destination);
					var offsidePosition = ''
					if (p.y > 0 && p.y < mapHeight + markerSize) {
						if (p.x <= -markerSize / 2)
							addOffsideIcon(route, 'left', 0, Math.round(p.y) - offsideIconSize / 2 - offsidesTop);
						else if (p.x >= mapWidth + markerSize / 2)
							addOffsideIcon(route, 'right', offsidesWidth - offsideIconSize, Math.round(p.y) - offsideIconSize / 2 - offsidesTop);
					}
					else if (p.x > markerSize / 2 && p.x < mapWidth + markerSize / 2) {
						if (p.y <= 0)
							addOffsideIcon(route, 'top', Math.round(p.x) - offsideIconSize / 2, 0);
						else if (p.y >= mapHeight + markerSize)
							addOffsideIcon(route, 'bottom', Math.round(p.x) - offsideIconSize / 2, offsidesHeight - offsideIconSize);
					}
				}
			}

			function parseServerData(data) {
				var routes = [];
				for (var i = 0; i < data.routes.length; ++i) {
					var route = data.routes[i];
					var points = [];

					for (var j = 0; j < route.points.length; ++j)
						points.push(map.getLocation(route.points[j].lat, route.points[j].lng));

					routes.push({
						name: route.name,
						icon: iconMap[route.icon || 0],
						points: points
					});
				}
				return routes;
			}

			$scope.prepareServerData = function (routes) {
				var data = {
					routes: [],
					defaultRoute: routes.length ? 0 : null
				};

				for (var i = 0; i < routes.length; ++i) {
					var route = routes[i];
					var points = [];

					for (var j = 0; j < route.points.length; ++j)
						points.push({ lat: route.points[j].lat(), lng: route.points[j].lng() });

					data.routes.push({
						name: route.name,
						points: points,
						icon: iconMap.indexOf(route.icon)
					});
				}

				return data;
			};

			$scope.prepareRoute = function (route, success, error) {
				prepareRoute(route, success, error);
			};

			$scope.addMarker = function (route) {
				addMarker(route);
			};

			$scope.updateRoutes = function (routes, callback) {
				$scope.routes = $scope.cloneRoutes(routes);
			};

			$scope.cloneRoutes = function (routes) {
				var clone = [];

				angular.forEach(routes, function (route, index) {
					var points = [];

					angular.forEach(route.points, function (point, index) {
						points.push(point);
					});

					clone.push({ name: route.name, icon: route.icon, points: points, conditions: route.conditions, marker: route.marker });
				});

				return clone;
			};

			$scope.navigateApp = function (key) {
				if (keyboard.isPressed(key, keyboard.keys.LEFT) && core.isVisible(mapControls))
					map.panTo(map.directions.LEFT);
				else if (keyboard.isPressed(key, keyboard.keys.RIGHT) && core.isVisible(mapControls))
					map.panTo(map.directions.RIGHT);
				else if (keyboard.isPressed(key, keyboard.keys.UP) && core.isVisible(mapControls))
					map.panTo(map.directions.UP);
				else if (keyboard.isPressed(key, keyboard.keys.DOWN) && core.isVisible(mapControls))
					map.panTo(map.directions.DOWN);
				else if (keyboard.isPressed(key, keyboard.keys.CHANNEL_UP) && core.isVisible(mapControls))
					map.zoomIn();
				else if (keyboard.isPressed(key, keyboard.keys.CHANNEL_DOWN) && core.isVisible(mapControls))
					map.zoomOut();
				else if (keyboard.isPressed(key, keyboard.keys.EXIT, keyboard.keys.FP_EXIT, keyboard.keys.BACK))
					core.quit();
				else
					return false;

				return true;
			};

			$scope.showMapControls = function () {
				core.show(mapControls);
			};

			$scope.hideMapControls = function () {
				core.hide(mapControls);
			};

			$timeout(function () {
				initialize();
			});
		}]);
})();