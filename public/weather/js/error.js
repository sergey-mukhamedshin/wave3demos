(function () {
	'use strict';

	/*global Config*/

	angular.module('weatherApp').controller('ErrorCtrl',
		['$scope', '$timeout', '$element', 'core', 'console', 'keyboard', 'focusable', 'controls', 'task', 'localization', 'dataProvider',
		function ($scope, $timeout, $element, core, console, keyboard, focusable, controls, task, localization, dataProvider) {
			var callback;
			var keyHandlers;

			core.registerController('ErrorCtrl', function (args) {
				if (args.show) {
					focusable.resetCurrent($element);

					callback = args.callback;
					keyHandlers = args.keyHandlers;

					$scope.title = args.title;
					$scope.hint = args.hint;
					$scope.text = args.text;

					$timeout(function () {
						controls.showOverlay($element[0]);
					});
				}
			});

			function hide() {
				controls.hideOverlay($element[0]);
			}

			$scope.navigate = function (key) {
				if (keyHandlers) {
					for (var i = 0; i < keyHandlers.length; ++i) {
						if (keyboard.isPressed(key, keyHandlers[i].key) && keyHandlers[i].handler) {
							hide();
							keyHandlers[i].handler();
							return true;
						}
					}
				}
				if (keyboard.isPressed(key, keyboard.keys.EXIT, keyboard.keys.FP_EXIT)) {
					hide();
					if (callback) {
						callback();
					}
					return true;
				}
				return false;
			};
		}]);
})();
