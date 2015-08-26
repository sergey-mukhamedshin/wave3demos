(function () {
	'use strict';

	//Toggle control
	angular.module('controls').directive('toggle', ['keyboard', function (keyboard) {
		return {
			scope: { values: '@', value: '@', onToggle: '=' },
			link: function (scope, element) {
				var active;
				var children = element.children();

				element.bind('keydown', function (event) {
					var values = scope.$eval(scope.values);

					if (keyboard.isPressed(event.which, keyboard.keys.OK)) {
						active = (active === 0) ? 1 : 0;
						scope.onToggle(values[active]);
						event.preventDefault();
						event.stopPropagation();
					}
					return false;
				});

				scope.$watch('value', function (newValue) {
					var values = scope.$eval(scope.values);

					for (var i = 0; i < children.length; ++i) {
						var e = angular.element(children[i]);
						if (values[i].toString() === newValue) {
							element.addClass('a' + i);
							e.addClass('active');
							active = i;
						}
						else {
							element.removeClass('a' + i);
							e.removeClass('active');
						}
					}
				});
			}
		};
	}]);

	//Toggle control
	angular.module('controls').directive('onFocus', [function () {
		return {
			link: function (scope, element, attrs) {
				var handler = scope.$eval(attrs.onFocus);

				element.bind('focus', function (event) {
					handler(element);
				});
			}
		};
	}]);


})();
