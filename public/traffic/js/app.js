(function () {
	'use strict';

	/*global platform, Config */

	var app = angular.module('traffic', ['core', 'logging', 'loader', 'keyboard', 'focusable', 'task', 'map', 'data', 'localization']);

	platform.runApplication('traffic', function () {
		app.run(['console', 'localization', function (console, localization) {
			console.setName('traffic');
			console.setLogLevel(Config.logLevel);
			console.info('Traffic version %1', Config.version);

			localization.setLocale(Config.language);
		}]);
	});
})();
