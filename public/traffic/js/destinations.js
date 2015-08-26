(function () {
	'use strict';

	angular.module('traffic').controller('DestinationsCtrl',
		['$scope', '$element', '$timeout', 'core', 'console', 'keyboard', 'focusable', 'controls', 'task', 'map', 'localization', 'dataProvider',
		function ($scope, $element, $timeout, core, console, keyboard, focusable, controls, task, map, localization, dataProvider) {

			var offsides = core.get('offsides');
			var routesList = core.get('routes-list');

			core.registerController('DestinationsCtrl', function () {
				$scope.selectDestinationsMode = false;
				focusable.resetCurrent(routesList);
				$scope.showMapControls();
				map.enableTraffic();
				controls.showOverlay($element[0]);
				controls.focus(offsides);
			});

			function selectDestinations() {
				$scope.selectDestinationsMode = true;
				$scope.hideMapControls();
				$timeout(function () {
					controls.focus(routesList);
				});
			}

			function manageDestinations() {
				//clearMap();
				controls.hideOverlay($element);
				core.callController('DeleteCtrl');
			}

			function centerHome() {
				map.setCenter($scope.homeLocation);
				$scope.homeMarker.setZIndex(map.MAX_ZINDEX);
			}

			$scope.navigate = function (key) {
				if (keyboard.isPressed(key, keyboard.keys.YELLOW)) {
					if ($scope.selectDestinationsMode) {
						$scope.selectDestinationsMode = false;
						$scope.showMapControls();
						focusable.resetCurrent(routesList);
						controls.focus(offsides);
					}
					else if ($scope.routes.length)
						selectDestinations();
					else
						centerHome();
				}
				else if (keyboard.isPressed(key, keyboard.keys.BLUE)) {
					if ($scope.routes.length)
						manageDestinations();
					else {
						controls.hideOverlay($element);
						core.callController('AddCtrl');
						controls.showOverlay(core.get('add-destination'));
					}
				}
				else
					return false;

				return true;
			};

			$scope.navigateMenu = function (key) {
				if (keyboard.isPressed(key, keyboard.keys.LEFT)) {
					return true;
				}
			};

			$scope.navigateHome = function (key) {
				if (keyboard.isPressed(key, keyboard.keys.UP)) {
					return true;
				}
				if (keyboard.isPressed(key, keyboard.keys.OK)) {
					centerHome();
					return true;
				}
				return false;
			};

			$scope.navigateDestination = function (key, route) {
				if (keyboard.isPressed(key, keyboard.keys.OK)) {
					route.marker.setZIndex(map.MAX_ZINDEX);
					map.setCenter(route.points[route.points.length - 1]);
					return true;
				}
				return false;
			};

			$scope.addDestination = function (key) {
				if (keyboard.isPressed(key, keyboard.keys.OK)) {
					//clearMap();
					controls.hideOverlay($element);
					core.callController('AddCtrl');
					return true;
				}
				return false;
			};

		}]);
})();
