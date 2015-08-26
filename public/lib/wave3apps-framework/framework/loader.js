'use strict';

angular.module('loader', ['logging']).service('loader', ['$q', '$timeout', 'console', function ($q, $timeout, console) {
	function loadScript(path) {
		var deferred = $q.defer();

		platform.loadScript(path,
			function () {
				console.info('script %1 loaded', path);
				$timeout(function () {
					deferred.resolve(path);
				});
			},
			function () {
				console.error('failed to load script %1', path);
				$timeout(function () {
					deferred.reject(path);
				});
			});

		return deferred.promise;
	}

	return {
		loadScript: function () {
			var promises = [];
			for (var i = 0; i < arguments.length; ++i)
				promises.push(loadScript(arguments[i]));
			return $q.all(promises);
		}
	};
}]);