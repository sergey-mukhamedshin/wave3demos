(function () {
	'use strict';

	/*global Config*/

	angular.module('weatherApp').controller('SettingsCtrl',
		['$scope', '$timeout', '$element', 'core', 'console', 'keyboard', 'focusable', 'controls', 'task', 'localization', 'dataProvider',
		function ($scope, $timeout, $element, core, console, keyboard, focusable, controls, task, localization, dataProvider) {
			var locationList = core.get('location-list');
			var settingList = core.get('setting-list');
			var changed;
			var callback;

			var MOVE_UP = 0;
			var	MOVE_DOWN = 1;
			var	DELETE = 2;

			core.registerController('SettingsCtrl', function (args) {
				changed = false;
				callback = args.callback;

				focusable.resetCurrent($element);

				$scope.locations = $scope.cloneLocations($scope.mylocations.locations);
				$scope.settings = angular.copy($scope.settings);

				if ($scope.locations.length)
					core.enable(locationList);
				else
					core.disable(locationList);

				$scope.buttonIndex = DELETE;
				controls.showOverlay($element[0]);
			});

			function refocus(newLocation, buttonIndex) {
				$timeout(function () {
					if ($scope.locations.length == 0) {
						controls.focus(settingList);
					}
					else {
						var locations = locationList.getElementsByClassName('location');
						var buttons = locations[newLocation].getElementsByClassName('button');

						if (newLocation == $scope.locations.length - 1 && buttonIndex == MOVE_DOWN)
							buttonIndex = MOVE_UP;
						if (newLocation == 0 && buttonIndex == MOVE_UP)
							buttonIndex = MOVE_DOWN;

						controls.focus(buttons[buttonIndex]);
					}
				});
			}

			function moveLocationUp(locationIndex) {
				if (locationIndex > 0) {
					var newIndex = locationIndex - 1;

					var temp = $scope.locations[locationIndex];
					$scope.locations[locationIndex] = $scope.locations[newIndex];
					$scope.locations[newIndex] = temp;

					updateLocations();
					refocus(newIndex, MOVE_UP);
				}
			}

			function moveLocationDown(locationIndex) {
				if (locationIndex < $scope.locations.length - 1) {
					var newIndex = locationIndex + 1;

					var temp = $scope.locations[locationIndex];
					$scope.locations[locationIndex] = $scope.locations[newIndex];
					$scope.locations[newIndex] = temp;

					updateLocations();
					refocus(newIndex, MOVE_DOWN);
				}
			}

			function deleteLocation(locationIndex) {
				var newIndex = locationIndex == $scope.locations.length - 1 ? locationIndex - 1 : locationIndex;
 
				$scope.locations.splice(locationIndex, 1);
				if (!$scope.locations.length) {
					core.disable(locationList);
				}

				updateLocations();
				refocus(newIndex, DELETE);
			}

			function updateSetting(key, value) {
				$timeout(function () {
					var settings = angular.copy($scope.settings);
					settings[key] = value;
					$scope.settings = settings;
					changed = true;
				});
			}

			function updateLocations() {
				core.invalidateRepeator($scope.locations);
				changed = true;
			}

			function exit() {
				$scope.buttonIndex = 0;
				controls.hideOverlay($element[0]);
				if (callback)
					callback($scope.locations, $scope.settings, changed);
			}

			$scope.toggleTemperature = function (newValue) {
				updateSetting('temperature', newValue);
			};

			$scope.toggleTime = function (newValue) {
				updateSetting('time', newValue);
			};

			$scope.toggleAlerts = function (newValue) {
				updateSetting('alerts', newValue);
			};

			$scope.onMoveUp = function (key, index) {
				if (keyboard.isPressed(key, keyboard.keys.OK)) {
					moveLocationUp(index);
					return true;
				}

				if (keyboard.isPressed(key, keyboard.keys.RIGHT) && index == $scope.locations.length - 1) {
					refocus(index, DELETE);
					return true;
				}
				return false;
			};

			$scope.onMoveDown = function (key, index) {
				if (keyboard.isPressed(key, keyboard.keys.OK)) {
					moveLocationDown(index);
					return true;
				}

				if (keyboard.isPressed(key, keyboard.keys.LEFT) && index == 0) {
					refocus(index, MOVE_DOWN);
					return true;
				}
				return false;
			};

			$scope.onDelete = function (key, index) {
				if (keyboard.isPressed(key, keyboard.keys.OK)) {
					deleteLocation(index);
					return true;
				}

				if (keyboard.isPressed(key, keyboard.keys.LEFT) && index == $scope.locations.length - 1) {
					refocus(index, MOVE_UP);
					return true;
				}
				return false;
			};

			$scope.exit = function (key) {
				if (keyboard.isPressed(key, keyboard.keys.OK)) {
					exit();
					return true;
				}
				return false;
			};

			$scope.navigate = function (key) {
				if (keyboard.isPressed(key, keyboard.keys.EXIT, keyboard.keys.FP_EXIT)) {
					exit();
					return true;
				}
				return false;
			};
		}]);
})();
