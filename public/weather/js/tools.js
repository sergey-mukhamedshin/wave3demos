(function () {
	'use strict';

	/*global Config*/

	angular.module('tools', []).service('tools', ['console', function (console) {
		var tools = {};
		var approximateSunrise = 7;
		var approximateSunset = 20;

		tools.fahrenheit2celsius = function (f) {
			return Math.round((f - 32) * 5 / 9);
		};

		tools.miles2kilometers = function (m) {
			return Math.round(m * 1.609344);
		};

		tools.getSeason = function (dateTime) {
			var month = (dateTime.getMonth() + 1) % 12;
			return ['winter', 'spring', 'summer', 'fall'][Math.floor(month / 3)];
		};

		tools.isNightTime = function (dateTime) {
			if (!dateTime)
				return false;
			return !(dateTime.getHours() >= approximateSunrise && dateTime.getHours() < approximateSunset);
		};

		tools.getLocalTime = function (timezone) {
			var time = new Date();
			return new Date(time.getTime() + (time.getTimezoneOffset() + timezone) * 60000);
		};

		return tools;
	}]);
})();
