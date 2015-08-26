'use strict';

angular.module('core', ['logging']).service('core', ['$rootScope', 'console', function ($rootScope, console) {
	var doNotWatchModelChange = 0;

	return {
		quit: function () {
			console.info('core.quit');
			platform.quit();
		},

		inherit: function (Child, Parent) {
			Parent.prototype.constructor = Parent;
			var F = function () { };
			F.prototype = Parent.prototype;
			Child.prototype = new F();
			Child.prototype.constructor = Child;
			Child.superclass = Parent.prototype;
		},

		get: function (id) {
			return document.getElementById(id);
		},

		enable: function (element) {
			angular.element(element).removeClass('disabled');
		},

		disable: function (element) {
			angular.element(element).addClass('disabled');
		},

		isEnabled: function (element) {
			return !angular.element(element).hasClass('disabled');
		},

		show: function (element) {
			angular.element(element).removeClass('hidden');
		},

		hide: function (element) {
			angular.element(element).addClass('hidden');
		},

		isVisible: function (element) {
			return !angular.element(element).hasClass('hidden');
		},

		doNotWatch: function (value) {
			++doNotWatchModelChange;
			return value;
		},

		watch: function (scope, watchExpression, listener) {
			scope.$watch(watchExpression, function (newValue, oldValue, scope) {
				if (doNotWatchModelChange != 0)
					--doNotWatchModelChange;
				else if (newValue !== oldValue)
					listener(newValue, oldValue, scope);
			});
		},

		invalidateRepeator: function (list) {
			for (var i = 0; i < list.length; ++i)
				delete list[i].$$hashKey;
		},

		registerController: function (controller, init) {
			$rootScope.$on('app_call_' + controller, function (event, args) {
				init(args);
			});
		},

		callController: function (controller, args) {
			console.info('%1 called with parameters %2', controller, angular.toJson(args));
			$rootScope.$emit('app_call_' + controller, args);
		}
	};
}]);