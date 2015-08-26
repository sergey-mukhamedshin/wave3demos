(function () {
	'use strict';

	angular.module('traffic').controller('DeleteCtrl',
		['$scope', '$element', '$timeout', 'core', 'console', 'keyboard', 'focusable', 'controls', 'task', 'map', 'localization', 'dataProvider',
		function ($scope, $element, $timeout, core, console, keyboard, focusable, controls, task, map, localization, dataProvider) {
			var deleteList = core.get('delete-list');
			var deletePopup = core.get('delete-popup');

			core.registerController('DeleteCtrl', function () {
				$scope.currentIndex = 1;
				$scope.hideMapControls();
				$timeout(function () {
					controls.showOverlay($element[0]);
				});
			});

			function showDeletePopup(index) {
				$scope.routeIndex = index;
				var elements = angular.element(deleteList).children();
				var bounds = elements[index].getBoundingClientRect();
				deletePopup.style.top = bounds.top + 'px';

				core.disable(deleteList);
				focusable.resetCurrent(deletePopup);
				core.show(deletePopup);
				controls.focus(deletePopup);
			}

			function hideDeletePopup() {
				core.hide(deletePopup);
				core.enable(deleteList);
				$timeout(function () {
					controls.focus(deleteList);
				});
			}

			$scope.deleteDestination = function (key) {
				if (keyboard.isPressed(key, keyboard.keys.OK)) {
					var routes = $scope.cloneRoutes($scope.routes);
					var deletedRoute = routes[$scope.routeIndex];
					routes.splice($scope.routeIndex, 1);

					controls.showMessage(localization.localize('MESSAGE_SAVING'));
					var serverData = $scope.prepareServerData(routes, 0);
					dataProvider.saveRoutes(serverData).then(
						function () {
							controls.hideMessage();
							$scope.updateRoutes(routes);
							map.removeMarker(deletedRoute.marker);
							core.invalidateRepeator($scope.routes);
							$scope.currentIndex = routes.length == 0 ? 0 : 1;
							hideDeletePopup();
						},
						function () {
							controls.hideMessage();
							controls.showPopup({
								message: localization.localize('ERROR_SAVING_ROUTES'),
								buttons: [{ text: localization.localize('BUTTON_OK'), handler: hideDeletePopup }]
							});
						}
					);
					return true;
				}
				return false;
			}

			$scope.hideDeletePopup = function (key) {
				if (keyboard.isPressed(key, keyboard.keys.OK)) {
					hideDeletePopup();
					return true;
				}
				return false;
			};

			$scope.showDeletePopup = function (key, index) {
				if (keyboard.isPressed(key, keyboard.keys.OK)) {
					showDeletePopup(index);
					return true;
				}
				return false;
			};

			$scope.addDestination = function (key) {
				if (keyboard.isPressed(key, keyboard.keys.OK)) {
					controls.hideOverlay($element);
					core.callController('AddCtrl');
					return true;
				}
				return false;
			};

			$scope.navigate = function (key) {
				if (keyboard.isPressed(key, keyboard.keys.BLUE)) {
					controls.hideOverlay($element);
					core.callController('DestinationsCtrl');
					return true;
				}
				return false;
			};
			
			$scope.currentChanged = function (index) {
				$scope.currentIndex = index;
			};
		}]);
})();
