'use strict';

(function() {
	function PopupCtrl ($scope, $element, $timeout, core, console, keyboard, focusable, controls) {
		//  keep argument names  in sync - see  ,controller() below
		
		function close() {
			controls.hidePopup();
		}

		core.registerController('PopupCtrl', function (config) {
			if (config.show) {
				focusable.resetCurrent($element);

				$scope.message = config.message;
				$scope.buttons = config.buttons;

				$timeout(function () {
					controls.showOverlay($element[0]);
				});
			}
			else
				controls.hideOverlay($element[0]);
		});

		$scope.onButtonKey = function (key, handler) {
			if (keyboard.isPressed(key, keyboard.keys.OK)) {
				close();
				if (typeof (handler) == 'function') {
					handler();
					return true;
				}
			}
			return false;
		};

		$scope.onKey = function (key) {
			if (keyboard.isPressed(key, keyboard.keys.OK, keyboard.keys.EXIT, keyboard.keys.BACK)) {
				close();
				return true;
			}
			return false;
		};
	}

	function MessageCtrl ($scope, $element, $timeout, core, controls) {
		//  keep argument names  in sync - see  ,controller() below

		core.registerController('MessageCtrl', function (config) {
			if (config.show) {
				$scope.message = config.message;

				$timeout(function () {
					controls.showOverlay($element[0]);
				});
			} else {
				controls.hideOverlay($element[0]);
			}
		});

		$scope.onKey = function () {
			return true;
		};
	}

	angular.module('controls', ['core', 'logging', 'keyboard', 'focusable'])
	.controller('PopupCtrl',
		['$scope', '$element', '$timeout', 'core', 'console', 'keyboard', 'focusable', 'controls', PopupCtrl])

	.controller('MessageCtrl',
		['$scope', '$element', '$timeout', 'core', 'controls', MessageCtrl])
	
	.service('controls', ['core', 'console', function (core, console) {
		var focusedElement = document.getElementsByTagName('body')[0];
		var delayedFocus = null;

		function setDelayedFocus(focus, owner) {
			console.dom(focus, 'focus delayed due to popup');
			delayedFocus = { focus: focus, owner: owner };
		}

		function commitDelayedFocusing() {
			if (delayedFocus && delayedFocus.focus) {
				console.dom(delayedFocus.focus, 'delayed focusing');
				var newFocus = delayedFocus.focus;
				delayedFocus = null;
				focus(newFocus);
			}
		}

		function canFocusImmediately(element) {
			if (delayedFocus && delayedFocus.focus) {
				return angular.element(element).controller() instanceof delayedFocus.owner;
			}
			return true;
		}

		function focus (element) {
			console.dom(element, 'focusing');
			if (element != focusedElement) {
				if (!canFocusImmediately(element)) {
					setDelayedFocus(element, delayedFocus.owner);
				}
				else {
					focusedElement.blur();
					focusedElement = element;
					element.focus();
				}
			}
		}

		return {
			focus: focus,

			getFocused: function () {
				return focusedElement;
			},

			setFocused: function (element) {
				focusedElement = element;
			},

			showOverlay: function (overlay) {
				core.show(overlay);
				focus(overlay);
			},

			hideOverlay: function (overlay) {
				core.hide(overlay);
			},

			showPopup: function (config) {
				setDelayedFocus(focusedElement, PopupCtrl);
				core.callController('PopupCtrl', angular.extend({ show: true }, config));
			},

			hidePopup: function () {
				core.callController('PopupCtrl', { show: false });
				commitDelayedFocusing();
			},

			showMessage: function (message) {
				setDelayedFocus(focusedElement, MessageCtrl);
				core.callController('MessageCtrl', { show: true, message: message });
			},

			hideMessage: function () {
				core.callController('MessageCtrl', { show: false });
				commitDelayedFocusing();
			}
		};
	}]);
})();