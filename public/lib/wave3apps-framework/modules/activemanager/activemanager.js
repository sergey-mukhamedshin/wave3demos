(function() {
	'use strict';

	var scopes = {};
	var currentScope;

	angular.module('activeManager', [])
	.factory('activeManager', ['$timeout', function($timeout) {
		function tryActivate() {
			if (scopes[currentScope])
				scopes[currentScope].$root.$broadcast('activate', currentScope);
			else
				$timeout(tryActivate, 0);
		}

		return {
			activate: function(name) {
				currentScope = name;
				$timeout(tryActivate, 0);
			},
			add: function(name, scope) {
				scopes[name] = scope;
			},
			get: function(name) {
				return scopes[name];
			},
			getActive: function() {
				return scopes[currentScope];
			},
			getActiveName: function() {
				return currentScope;
			},
			remove: function(name) {
				delete scopes[name];
			}
		};
	}]);
})();