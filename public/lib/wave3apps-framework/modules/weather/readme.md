
# Weather

Weather service provides actual weather data.

## API

All APIs use messaging module for interaction

### watchDefaultLocationWise
Start update weather data for default location by timeout.
Generate `defaultLocationWiseUpdated` event.

## Usage

```javascript

(function() {
	'use strict';
	var NAMESPACE = 'apps/weather-widget';

	angular.module(NAMESPACE, ['messaging'])
		.controller('WeatherController', [
			'$scope', 'messagingService',
			function($scope, messagingService) {
				var ms = messagingService(NAMESPACE);

				ms.subscribe('weather:defaultLocationWiseUpdated', function(e) {
					$scope.location = e.message.name;
					$scope.fctcode = e.message.outlook;
					$scope.t = e.message.temperature;

					$scope.$digest();
				});

				ms.send('weather:watchDefaultLocationWise', null, {waitForSubscriber: true});
			}
		]);
})();

```