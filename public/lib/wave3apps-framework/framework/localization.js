'use strict';

angular.module('localization', [])
	.value('resources', {})
	.service('localization', ['resources', function (resources) {
		var defaultLocale = 'en-CA';
		var currentLocale = defaultLocale;

		return {
			getLocale: function () {
				return currentLocale;
			},
			setLocale: function (locale) {
				currentLocale = locale || 'en-CA';
			},
			localize: function (text) {
				var res = resources[currentLocale];
				if (res.hasOwnProperty(text)) {
					return res[text];
				}

				res = resources[defaultLocale];
				if (res.hasOwnProperty(text)) {
					return res[text];
				}

				return text;
			},
		};
	}])
	.filter('localize', ['localization', function (localization) {
		return function (text) {
			return localization.localize(text);
		};
	}])

	.directive('localized', ['localization', function (localization) {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				var kv = attrs.localized.split(':');
				if (kv[0] == 'text') {
					element.text(localization.localize(kv[1]));
				}
				else {
					element.attr(kv[0], localization.localize(kv[1]));
				}
			}
		};
	}])
	.directive('local', ['localization', function (localization) {
		return {
			restrict: 'C',
			link: function (scope, element) {
				element.removeClass('local');
				element.addClass(localization.getLocale().toLowerCase());
			}
		};
	}]);

/*
function debugWatchers() {
	var root = angular.element(document.getElementsByTagName('body'));
	var watchers = [];

	var f = function (element) {

		if (element.data().hasOwnProperty('$scope')) {
			angular.forEach(element.data().$scope.$$watchers, function (watcher) {
				watchers.push(watcher);
			});
		}

		angular.forEach(element.children(), function (childElement) {
			f(angular.element(childElement));
		});
	};

	f(root);

	console.log("watchers.length = " + watchers.length);
	return "watchers.length = " + watchers.length;
}
*/