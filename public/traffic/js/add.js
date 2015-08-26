(function () {
	'use strict';

	angular.module('traffic').controller('AddCtrl',
		['$scope', '$element', 'core', 'console', 'keyboard', 'focusable', 'controls', 'task', 'map', 'localization', 'dataProvider',
		function ($scope, $element, core, console, keyboard, focusable, controls, task, map, localization, dataProvider) {

			var predefined = core.get('predefined');
			var nameEntry = core.get('name-entry');
			var iconSelection = core.get('icon-selection');
			var confirmation = core.get('confirmation');

			var saveName = core.get('save-name');
			var addInstructions = core.get('add-instructions');
			var nameInputBox = core.get('name');
			var newMarker = core.get('new-marker');

			var toolbarStyle = getComputedStyle(predefined);
			var toolbarHeight = parseInt(toolbarStyle.height);
			var newMarkerStyle = getComputedStyle(newMarker);
			var newMarkerHeight = parseInt(newMarkerStyle.height);
			var newMarkerTop = parseInt(newMarkerStyle.top);
			var mapStyle = getComputedStyle(core.get('map'));
			var mapHeight = parseInt(mapStyle.height);

			var markerShiftedTop = mapHeight - toolbarHeight - newMarkerHeight;
			var shift = newMarkerTop - markerShiftedTop;
			var shifted;

			var predefinedNames = {
				"work": localization.localize('PREDEFINED_WORK'),
				"school": localization.localize('PREDEFINED_SCHOOL'),
				"store": localization.localize('PREDEFINED_STORE'),
				"family": localization.localize('PREDEFINED_FAMILY'),
				"travel": localization.localize('PREDEFINED_TRAVEL')
			};

			core.registerController('AddCtrl', function () {
				shifted = false;
				$scope.showMapControls();

				$scope.destinationLocation = null;
				$scope.destinationName = null;
				$scope.destinationIcon = null;

				newMarker.style.top = newMarkerTop + 'px';

				core.hide(predefined);
				core.hide(nameEntry);
				core.hide(iconSelection);
				core.hide(confirmation);
				core.show(addInstructions);

				map.disableTraffic();
				focusable.resetCurrent($element);

				controls.showOverlay($element[0]);
			});

			core.watch($scope, 'destinationName', function (name) {
				if (!$scope.destinationName)
					core.disable(saveName);
				else
					core.enable(saveName);
			});

			function close() {
				//task.ignore('findRoutes');
				if (shifted) {
					newMarker.style.top = newMarkerTop + 'px';
					map.panTo({ x: 0, y: -shift });
				}

				controls.hideOverlay($element);
				core.callController('DestinationsCtrl');
			}

			function showPanel(panel) {
				core.hide(addInstructions);
				core.hide(predefined);
				core.hide(nameEntry);
				core.hide(iconSelection);
				core.hide(confirmation);

				core.show(panel);
				controls.focus(panel);
			}

			function addDestination() {
				var newRoute = {
					name: $scope.destinationName,
					icon: $scope.destinationIcon,
					points: [$scope.destinationLocation]
				};

				controls.showMessage(localization.localize('MESSAGE_SAVING'));

				$scope.prepareRoute(newRoute,
					function () {
						var routes = $scope.cloneRoutes($scope.routes);
						routes.push(newRoute);

						var serverData = $scope.prepareServerData(routes, 0);
						dataProvider.saveRoutes(serverData).then(
							function () {
								$scope.addMarker(newRoute);
								$scope.updateRoutes(routes);
								controls.hideMessage();
								close();
							},
							function () {
								controls.hideMessage();
								controls.showPopup({
									message: localization.localize('ERROR_SAVING_ROUTES'),
									buttons: [{ text: localization.localize('BUTTON_OK') }]
								});
							}
						);
					},
					function () {
						controls.hideMessage();
						controls.showPopup({
							message: localization.localize('ERROR_SAVING_ROUTES'),
							buttons: [{ text: localization.localize('BUTTON_OK') }]
						});
					}
				);
			}

			$scope.navigate = function (key) {
				if (keyboard.isPressed(key, keyboard.keys.OK)) {
					if (!$scope.destinationLocation) {
						$scope.hideMapControls();
						$scope.destinationLocation = map.getCenter();
						newMarker.style.top = markerShiftedTop + 'px';
						map.panTo({ x: 0, y: shift });
						showPanel(predefined);
						shifted = true;
						return true;
					}
				}
				else if (keyboard.isPressed(key, keyboard.keys.BLUE) && controls.getFocused() != nameInputBox) {
					close();
					return true;
				}
				return false;
			};

			$scope.cancel = function (key) {
				if (keyboard.isPressed(key, keyboard.keys.OK)) {
					close();
					return true;
				}
				return false;
			};

			$scope.addDestination = function (key) {
				if (keyboard.isPressed(key, keyboard.keys.OK)) {
					addDestination();
					close();
					return true;
				}
				return false;
			};

			$scope.editIcon = function (key) {
				if (keyboard.isPressed(key, keyboard.keys.OK)) {
					showPanel(iconSelection);
					return true;
				}
				return false;
			};

			$scope.editName = function(key) {
				if (keyboard.isPressed(key, keyboard.keys.OK)) {
					showPanel(nameEntry);
					return true;
				}
				return false;

			};

			$scope.savePredefined = function (key, data) {
				if (keyboard.isPressed(key, keyboard.keys.OK)) {
					$scope.destinationName = predefinedNames[data];
					$scope.destinationIcon = data;
					showPanel(confirmation);
					return true;
				}
				return false;
			};

			$scope.saveIcon = function (key, data) {
				if (keyboard.isPressed(key, keyboard.keys.OK)) {
					$scope.destinationIcon = data.toLowerCase();
					showPanel(confirmation);
					return true;
				}
				return false;
			};
			
			$scope.saveName = function (key) {
				if (keyboard.isPressed(key, keyboard.keys.OK)) {
					if ($scope.destinationIcon)
						showPanel(confirmation);
					else
						showPanel(iconSelection);
					return true;
				}
				return false;
			};
		}]);
})();
