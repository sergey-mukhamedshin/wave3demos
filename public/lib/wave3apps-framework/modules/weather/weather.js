/**
 * Weather service.
 */
(function() {
	'use strict';
	var NAMESPACE = 'weather';
	var ms;
	var ss;
	var settings = {};
	var availableSettings = {
		appName: 'Weather',
		blocks:[
			{
				name: 'General settings',
				elements: [
					{
						name: 'Refresh interval (minutes)',
						description: 'Update weather information from server interval.',
						id: 'updateInterval',
						type: 'select',
						values: [1, 3, 5, 10, 15, 30, 60, 120, 240],
						defaultValue: 1
					}
				]
			},
			{
				name: 'Alerts',
				description: 'Each time a new weather alert is issued for your default location it will briefly display on screen.',
				elements: [
					{
						name: 'Alerts',
						description: 'Display weather alerts outside of the app?',
						id: 'alerts',
						type: 'on/off',
						values: ['Yes', 'No'],
						defaultValue: 'Yes'
					}
				]
			}
		]
	};
	var defaultLocationWiseTimer;

	angular.module(NAMESPACE, ['messaging', 'settings'])
		.factory('weatherService', [
			'$http', '$timeout', 'loadConfig', 'messagingService', 'settingService',
			function($http, $timeout, loadConfig, messagingService, settingService) {
				if (!ms) {
					ms = messagingService(NAMESPACE);
					ss = settingService(NAMESPACE);

					ss.get().then(function(s) {
						settings = s;
						availableSettings.blocks[0].elements[0].defaultValue = Math.round(settings.updateInterval / 60000);

						ms.subscribe('getSettings', function(e) {
							ms.send('settings', availableSettings, {broadcast: false, namespace: e.from});
						});
						ms.subscribe('setSettings', function(e) {
							angular.extend(availableSettings, e.message);
						});

						getDefaultLocationWise = getDefaultLocationWise.bind({}, $http, $timeout);
						ms.subscribe('watchDefaultLocationWise', getDefaultLocationWise);
					});
				}

				return null;
			}
		])
		.run(['weatherService', function() {}]);

	var inProgress = false;
	function getDefaultLocationWise($http, $timeout) {
		if (inProgress)
			return;

		inProgress = true;

		$http.get(settings.serverURL + 'locationwise?location=' + settings.defaultLocation.id).then(function(res) {
			inProgress = false;

			var lw = res.data[0];
			ms.send(
				'defaultLocationWiseUpdated',
				{
					feelsLike:         lw.feelsLike,
					location:          lw.location,
					name:              settings.defaultLocation.name,
					outlook:           lw.outlook || 0,
					temperature:       settings.temperature ? lw.temperature : f2c(lw.temperature),
					temperatureFormat: settings.temperature,
					timeZone:          lw.timeZone,
					timestamp:         lw.timestamp
				}
			);
		});

		$timeout.cancel(defaultLocationWiseTimer);
		defaultLocationWiseTimer = $timeout(getDefaultLocationWise, settings.updateInterval);
	}

	function f2c(f) {
		return Math.round((f - 32) * 5 / 9);
	}
})();