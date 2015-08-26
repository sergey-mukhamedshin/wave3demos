(function () {
	'use strict';

	/*global platform, Config */

	//Application module
	var app = angular.module('weatherApp', ['core', 'logging', 'keyboard', 'focusable', 'controls', 'task', 'dataProvider', 'tools', 'localization']);

	platform.runApplication('weatherApp', function () {
		window.app = app;
		app.run(['$rootScope', '$filter', 'core', 'console', 'controls', 'localization', 'tools', 'dataProvider',
			function ($rootScope, $filter, core, console, controls, localization, tools, dataProvider) {
				console.setName('weatherApp');
				console.setLogLevel(Config.logLevel);
				console.info('Weather version %1', Config.version);

				$rootScope.dataProvider = dataProvider;
				localization.setLocale(Config.language);
			}
		]);
	});
})();
