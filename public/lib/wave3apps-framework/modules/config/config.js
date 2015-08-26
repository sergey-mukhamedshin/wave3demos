/**
 * Config provides an configuration data.
 */
(function(window, angular) {
	'use strict';

	var config = {};
	
	var module = angular.module('config', []);

	module.value('config', config);

	module.run(['loadConfig', function(loadConfig) {
		loadConfig.then(function(e) {
			patch(config, e.data);
			return e.data;
		});
	}]);

	module.factory('loadConfig', ['$http', 'config', function($http, config) {
		return $http.get('config.json');
	}]);

	function find(src, key) {
		if (src.hasOwnProperty(key))
			return src[key];
		else {
			for (var prop in src)
				if (src.hasOwnProperty(prop)) {
					var value = find(src[prop], key);
					if (typeof value != 'undefined')
						return value;
				}
		}
	}

	function replace(dest, src) {
		function repl(orig, match1) {
			var found = find(src, match1);
			return typeof found != 'undefined' ? found : orig;
		}

		for (var prop in dest)
			if (dest.hasOwnProperty(prop) && typeof dest[prop] === 'string')
				dest[prop] = dest[prop].replace(/{{\s*([^}]+?)\s*}}/g, repl);
			else
				replace(dest[prop], src);
	}

	function patch(dest, src) {
		replace(src, src);
		angular.extend(dest, src);
	}
})(window, window.angular);