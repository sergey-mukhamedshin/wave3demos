(function () {
	'use strict';

	/*global Config*/

	angular.module('weatherApp').controller('TermsCtrl', ['$scope', '$element', 'core', 'keyboard', 'controls',
		function ($scope, $element, core, keyboard, controls) {
			var arrowUp = core.get('terms-up');
			var arrowDown = core.get('terms-down');
			var termsText = core.get('terms-text');
			var onAccept;
			var SCROLL_STEP = 100;

			core.registerController('TermsCtrl', function (args) {
				onAccept = args.onAccept;
				controls.showOverlay($element[0]);
				updateArrows();
			});

			function updateArrows() {
				core.hide(arrowDown);
				core.hide(arrowUp);

				if (termsText.scrollHeight - termsText.scrollTop > termsText.clientHeight)
					core.show(arrowDown);
				if (termsText.scrollTop > 0)
					core.show(arrowUp);
			}

			$scope.navigate = function (key) {
				if (keyboard.isPressed(key, keyboard.keys.UP)) {
					termsText.scrollTop -= SCROLL_STEP;
					updateArrows();
					return true;
				}
				else if (keyboard.isPressed(key, keyboard.keys.DOWN)) {
					termsText.scrollTop += SCROLL_STEP;
					updateArrows();
					return true;
				}
				return false;
			};

			$scope.onAccept = function (key) {
				if (keyboard.isPressed(key, keyboard.keys.OK)) {
					controls.hideOverlay($element[0]);
					onAccept();
					return true;
				}
				return false;
			};

			$scope.onDeny = function (key) {
				if (keyboard.isPressed(key, keyboard.keys.OK)) {
					core.quit();
					return true;
				}
				return false;
			};
		}]);
})();
