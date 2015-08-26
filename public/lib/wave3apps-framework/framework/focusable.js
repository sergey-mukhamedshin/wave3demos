'use strict';

(function () {
	angular.module('focusable', ['core', 'logging', 'keyboard', 'controls']).run(['core', 'console', 'controls', function (core, console, controls) {
		hierarchy = {};

		hierarchy.Leaf = function (element) {
			this.element = element[0];
		};

		hierarchy.Leaf.prototype = {
			bind: function (parent) {
				this.parent = parent;
				if (parent)
					parent.children.push(this);
			},

			unbind: function () {
				if (this.parent) {
					var i = this.parent.children.indexOf(this);
					if (i >= 0)
						this.parent.children.splice(i, 1);
				}
			},

			onFocus: function () {
				var child = this;
				var parent = this.parent;

				// updating all hierarchy upwards for mouse-oriented navigation, otherwise we might update only immediate parent
				while (parent) {
					if (parent.children[parent.focusedChild] != child) {
						parent.focusedChild = parent.children.indexOf(child);
						this._onCurrentChanged(parent);
					}

					child = parent;
					parent = parent.parent;
				}
			},

			_onCurrentChanged: function (node) {
				if (node.onCurrentChanged) {
					console.dom(node.element, 'firing onCurrentChanged: %1', node.focusedChild);
					node.onCurrentChanged.call(node.element, node.focusedChild, node.children[node.focusedChild].element);
				}
			}
		};

		hierarchy.Node = function (element) {
			hierarchy.Node.superclass.constructor.call(this, element);
			this.children = [];
			this.focusedChild = 0;
		};

		core.inherit(hierarchy.Node, hierarchy.Leaf);

		hierarchy.Node.prototype.onFocus = function () {
			if (this.children.length) {
				var focused = this;

				while (focused.children && focused.children.length) {
					var child = focused.children[focused.focusedChild];
					if (!core.isVisible(child.element) || !core.isEnabled(child.element))
						break;

					focused = child;
				}

				controls.focus(focused.element); // onFocus will update all the hierarchy upwards
			}
			else
				hierarchy.Node.superclass.onFocus.call(this);
		};

		hierarchy.Node.prototype.onResetCurrent = function () {
			this.focusedChild = 0;
			for (var i = 0; i < this.children.length; ++i) {
				if (this.children[i].children)
					this.children[i].onResetCurrent();
			}
		};
		/*
		hierarchy.Node.prototype.onSetCurrent = function (index) {
			this.focusedChild = index;
		};
		*/
	}])

	.service('focusable', [function () {
		return {
			resetCurrent: function (element) {
				angular.element(element).triggerHandler('resetCurrent');
			}
			/*
			setCurrent: function (element, index) {
				angular.element(element).triggerHandler('setCurrent', [index]);
			}
			*/
		};
	}])

	.directive('focusableGroup', ['core', 'console', 'controls', 'keyboard', function (core, console, controls, keyboard) {
		function isBetter(
			focusedLeft, focusedRight, focusedTop, focusedBottom,
			thisLeft, thisRight, thisTop, thisBottom,
			bestLeft, bestRight, bestTop, bestBottom) {

			// comparison for navigation to left, other directions are mimicked by shuffling parameters

			if (thisLeft >= focusedLeft || thisRight > focusedRight) // element is at focus' right
				return false;
			if (thisRight < bestRight) // element is farther from focus than best one
				return false;
			if (thisRight > bestRight) // element is closer to focus than best one
				return true;

			/*
			var focusedCenter = (focusedTop + focusedBottom) >> 1;
			var thisCenter = (thisTop + thisBottom) >> 1;
			var bestCenter = (bestTop + bestBottom) >> 1;
			var thisProximity = thisCenter < focusedCenter ? focusedTop - thisBottom : thisTop - focusedBottom;
			var bestProximity = bestCenter < focusedCenter ? focusedTop - bestBottom : bestTop - focusedBottom;

			below is an optimized expression:
			*/
			var thisProximity = thisTop + thisBottom < focusedTop + focusedBottom ? focusedTop - thisBottom : thisTop - focusedBottom;
			var bestProximity = bestTop + bestBottom < focusedTop + focusedBottom ? focusedTop - bestBottom : bestTop - focusedBottom;

			return thisProximity < bestProximity; // compare vertical proximity
		}

		function getNavigationStrategy(key) {
			if (keyboard.isPressed(key, keyboard.keys.LEFT)) {
				return {
					worstRect: { left: Number.NEGATIVE_INFINITY, right: Number.NEGATIVE_INFINITY, top: Number.POSITIVE_INFINITY, bottom: Number.POSITIVE_INFINITY },
					isBetter: function (focusedRect, thisRect, bestRect) {
						return isBetter(
							focusedRect.left, focusedRect.right, focusedRect.top, focusedRect.bottom,
							thisRect.left, thisRect.right, thisRect.top, thisRect.bottom,
							bestRect.left, bestRect.right, bestRect.top, bestRect.bottom);
					}
				};
			} else if (keyboard.isPressed(key, keyboard.keys.RIGHT)) {
				return {
					worstRect: { left: Number.POSITIVE_INFINITY, right: Number.POSITIVE_INFINITY, top: Number.POSITIVE_INFINITY, bottom: Number.POSITIVE_INFINITY },
					isBetter: function (focusedRect, thisRect, bestRect) {
						return isBetter(
							-focusedRect.right, -focusedRect.left, focusedRect.top, focusedRect.bottom,
							-thisRect.right, -thisRect.left, thisRect.top, thisRect.bottom,
							-bestRect.right, -bestRect.left, bestRect.top, bestRect.bottom);
					}
				};
			} else if (keyboard.isPressed(key, keyboard.keys.UP)) {
				return {
					worstRect: { left: Number.POSITIVE_INFINITY, right: Number.POSITIVE_INFINITY, top: Number.NEGATIVE_INFINITY, bottom: Number.NEGATIVE_INFINITY },
					isBetter: function (focusedRect, thisRect, bestRect) {
						return isBetter(
							focusedRect.top, focusedRect.bottom, focusedRect.right, focusedRect.left,
							thisRect.top, thisRect.bottom, thisRect.right, thisRect.left,
							bestRect.top, bestRect.bottom, bestRect.right, bestRect.left);
					}
				};
			} else if (keyboard.isPressed(key, keyboard.keys.DOWN)) {
				return {
					worstRect: { left: Number.POSITIVE_INFINITY, right: Number.POSITIVE_INFINITY, top: Number.POSITIVE_INFINITY, bottom: Number.POSITIVE_INFINITY },
					isBetter: function (focusedRect, thisRect, bestRect) {
						return isBetter(
							-focusedRect.bottom, -focusedRect.top, focusedRect.right, focusedRect.left,
							-thisRect.bottom, -thisRect.top, thisRect.right, thisRect.left,
							-bestRect.bottom, -bestRect.top, bestRect.right, bestRect.left);
					}
				};
			}
			return null;
		}

		return {
			require: '?^focusableGroup',
			restrict: 'A',
			controller: ['$scope', '$element', function ($scope, $element) {
				this.hierarchy = new hierarchy.Node($element);
			}],
			link: function (scope, element, attrs) {
				element.attr('tabindex', '-1');

				var hierarchy = element.controller('focusableGroup').hierarchy;
				var parentController = element.parent().controller('focusableGroup');
				hierarchy.bind(parentController ? parentController.hierarchy : null);

				hierarchy.onCurrentChanged = scope.$eval(attrs.currentChanged);

				if ('currentIndex' in attrs) {
					attrs.$observe('currentIndex', function (value) {
						var focused = '' == value ? 0 : parseInt(value, 10);
						console.dom(element, 'currentIndex changed from %1 to %2', hierarchy.focusedChild, focused);
						hierarchy.focusedChild = focused;
					});
				}

				element.bind('focus', function () {
					controls.setFocused(element[0]); // for mouse-oriented navigation
					hierarchy.onFocus();
				});

				element.bind('resetCurrent', function () {
					console.dom(element, 'resetCurrent received');
					hierarchy.onResetCurrent();
				});

				/*
				element.bind('setCurrent', function (event, index) {
					console.dom(element, 'setCurrent received');
					hierarchy.onSetCurrent(index);
				});
				*/

				element.bind('keydown', function (event) {
					var key = event.which;
					var navStrategy = getNavigationStrategy(key);

					if (navStrategy) {
						console.dom(element, 'arrow key %1 pressed', key);

						var focused = hierarchy.children[hierarchy.focusedChild].element;
						var focusedRect = focused.getBoundingClientRect();
						var bestRect = navStrategy.worstRect;
						var found = -1;

						for (var i = 0; i < hierarchy.children.length; ++i) {
							var sibling = hierarchy.children[i].element;
							if (sibling != focused && core.isVisible(sibling) && core.isEnabled(sibling)) {
								var thisRect = sibling.getBoundingClientRect();
								if (navStrategy.isBetter(focusedRect, thisRect, bestRect)) {
									found = i;
									bestRect = thisRect;
								}
							}
						};

						if (found != -1) {
							console.dom(focused, 'navigating to focusable %1', found);
							controls.focus(hierarchy.children[found].element);
							event.preventDefault();
							event.stopPropagation();
						}
					}
				});

				scope.$on('$destroy', function () {
					console.dom(element, 'destroyed');
					hierarchy.unbind();
				});
			}
		};
	}])

	.directive('focusable', ['console', 'controls', function (console, controls) {
		return {
			require: '?^focusableGroup',
			restrict: 'A',
			controller: ['$scope', '$element', function ($scope, $element) {
				this.hierarchy = new hierarchy.Leaf($element);
			}],
			link: function (scope, element, attrs, parentController) {
				var domElement = element[0];
				element.attr('tabindex', '-1');

				if (attrs.tag) {
					var tag = scope.$eval(attrs.tag);
					// $eval() returns 0, if expression contains '-'
					element.data('tag', typeof (tag) == 'undefined' || attrs.tag.indexOf('-') != -1 ? attrs.tag : tag);
				}

				var hierarchy = element.controller('focusable').hierarchy;
				hierarchy.bind(parentController ? parentController.hierarchy : null);

				var menuContainer = ('scrollable' in attrs) ? hierarchy.parent.element : null;

				element.bind('focus', function () {
					controls.setFocused(domElement); // for mouse-oriented navigation
					hierarchy.onFocus();

					if (menuContainer) {
						if (domElement.offsetLeft < menuContainer.scrollLeft || domElement.offsetWidth > menuContainer.clientWidth) {
							console.dom(element, 'aligning to left');
							menuContainer.scrollLeft = domElement.offsetLeft;
						} else {
							var dx = domElement.offsetLeft + domElement.offsetWidth - menuContainer.scrollLeft - menuContainer.clientWidth;
							if (dx > 0) {
								console.dom(element, 'aligning to right');
								menuContainer.scrollLeft += dx;
							}
						}
					}
				});

				scope.$on('$destroy', function () {
					console.dom(element, 'destroyed');
					hierarchy.unbind();
				});
			}
		};
	}])

	.directive('onKey', [function () {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				var handler = scope.$eval(attrs.onKey);

				element.bind('keydown', function (event) {
					var target = event.target;
					var key = event.which;
					var keyHandled = scope.$apply(function () { return handler.call(target, key, angular.element(target).data('tag')); });

					if (keyHandled) {
						event.preventDefault();
						event.stopPropagation();
					}
				});
			}
		};
	}])

	.directive('input', ['keyboard', function (keyboard) {
		function setReadonly(element, value) {
			if (value) {
				element[0].setAttribute('readonly', 'readonly');
				platform.hideKeyboard(element[0]);
			}
			else {
				element[0].removeAttribute('readonly');
				platform.showKeyboard(element[0], function () {
					element.triggerHandler('input');
				});
			}
		}

		function isReadonly(element) {
			return element[0].hasAttribute('readonly');
		}

		return {
			restrict: 'E',
			priority: -1,
			link: function (scope, element) {
				setReadonly(element, true);

				element.bind('keydown', function (event) {
					if (event.isDefaultPrevented())
						return;

					var key = event.which;
					var handled = false;
					if (isReadonly(element)) {
						if (keyboard.isPressed(key, keyboard.keys.OK)) {
							setReadonly(element, false);
							handled = true;
						}
					}
					else {
						if (keyboard.isPressed(key, keyboard.keys.OK, keyboard.keys.EXIT)) {
							setReadonly(element, true);
							handled = true;
						}
						else if (keyboard.isPressed(key, keyboard.keys.LEFT, keyboard.keys.RIGHT, keyboard.keys.UP, keyboard.keys.DOWN)) {
							handled = true;
						}
						else if (keyboard.isPressed(key, keyboard.keys.BACK)) { // TODO: virtual keyboard may not have BACKSPACEs
							handled = true;
						}
					}

					if (handled)
						event.stopPropagation();
				});
			},
			controller: ['$element', function ($element) {
				this.setReadonly = function (value) {
					setReadonly($element, value);
				};
			}]
		};
	}])

	var hierarchy;
})();

