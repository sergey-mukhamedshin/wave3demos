(function () {
	'use strict';

	angular.module('traffic').controller('WelcomeCtrl',
		['$scope', '$timeout', '$element', 'core', 'keyboard', 'focusable', 'controls', 'localization', 'dataProvider',
		function ($scope, $timeout, $element, core, keyboard, focusable, controls, localization, dataProvider) {

			var tabs = angular.element(core.get('tabs')).children();
			var progress = angular.element(core.get('progress')).children();
			var tabIndex = -1;

			core.registerController('WelcomeCtrl', function () {
				controls.showOverlay($element[0]);
				showTab(0);
			});

			function showTab(index) {
				if (index != tabIndex) {
					if (tabIndex != -1) {
						core.hide(tabs[tabIndex]);
						progress[tabIndex].className = '';
					}

					tabIndex = index;
					core.show(tabs[tabIndex]);
					progress[tabIndex].className = 'active';

					controls.focus(tabs[index]);
				}
			}

			$scope.nextStep = function (key) {
				if (keyboard.isPressed(key, keyboard.keys.OK)) {
					//showTab(currentTabIndex + 1);
					showTab(tabIndex + 1);
					return true;
				}
				return false;
			};

			$scope.showMap = function (key) {
				if (keyboard.isPressed(key, keyboard.keys.OK)) {
					controls.hideOverlay($element);
					core.callController('DestinationsCtrl');
					return true;
				}
				return false;
			};

			$scope.showAddDestination = function (key) {
				if (keyboard.isPressed(key, keyboard.keys.OK)) {
					controls.hideOverlay($element);
					core.callController('AddCtrl');
					return true;
				}
				return false;
			};
		}]);
})();
