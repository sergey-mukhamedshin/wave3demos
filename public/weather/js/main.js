(function () {
	'use strict';

	/*global Config*/
	angular.module('weatherApp').controller('MainCtrl',
		['$scope', '$timeout', '$filter', 'core', 'console', 'keyboard', 'controls', 'localization', 'tools', 'dataProvider',
		function ($scope, $timeout, $filter, core, console, keyboard, controls, localization, tools, dataProvider) {
			function initialize() {
				//window.onresize = adjustZoom;
				//adjustZoom();

				$scope.updateBackground();

				if (!isLocalStorageSupproted()) {
					console.info('LocalStorage is not supported.');
					$scope.showFatalError('ERROR_CAPTION', 'ERROR_LOCAL_STORAGE');
					return;
				}

				if (areTermsDisabled() || areTermsAccepted()) {
					load();
					return;
				}

				core.callController('TermsCtrl', {
					onAccept: function () {
						acceptTerms();
						load();
					}
				});
			}

			//function adjustZoom() {
			//	var bodyStyle = getComputedStyle(document.body);
			//	var x = (window.innerWidth || document.documentElement.clientWidth || document.body.offsetWidth) / parseInt(bodyStyle.width);
			//	var y = (window.innerHeight || document.documentElement.clientHeight || document.body.offsetHeight)  / parseInt(bodyStyle.height);
			//	document.body.style.zoom = Math.round((Math.min(x, y) * 100)) + "%";
			//}

			function isLocalStorageSupproted() {
				return typeof(Storage) != 'undefined';
			}

			function areTermsDisabled() {
				return Config.disableTermsAndConditions;
			}

			function areTermsAccepted() {
				return localStorage.termsAccepted;
			}

			function acceptTerms() {
				localStorage.termsAccepted = true;
			}

			function load() {
				controls.showMessage(localization.localize('POPUP_TEXT_LOADING'));
				$scope.settings = {};
				dataProvider.settings().then(
					function (data) {
						$scope.setSettingsItem(data);
						$scope.mylocations = {};
						dataProvider.myLocations().then(
							function (data) {
								$scope.setMylocationsItems(data);
								onReady();
							},
							function () {
								$scope.showFatalError('ERROR_DATA_CAPTION', 'ERROR_DATA_TEXT');
							}
						);
					},
					function () {
						$scope.showFatalError('ERROR_DATA_CAPTION', 'ERROR_DATA_TEXT');
					}
				);
			}

			function onReady() {
				if ($scope.mylocations && $scope.mylocations.locations.length > 0) {
					console.info('showing start page...');
					core.callController('WeatherCtrl', { load: true });
				}
				else {
					addDefaultLocation();
				}
			}

			function addDefaultLocation() {
				dataProvider.currentLocation().then(
					function (currentLocationData) {
						var serverData = $scope.prepareLocationsData([currentLocationData], 0);
						dataProvider.saveLocations(serverData).then(
							function () {
								$scope.setMylocationsItems(serverData);
								controls.hideMessage();
								core.callController('WeatherCtrl', { load: true });

							},
							function () {
								$scope.showFatalError('ERROR_SAVE_CAPTION', 'ERROR_DATA_TEXT');
							}
						);
					},
					function () {
						$scope.showFatalError('ERROR_DATA_CAPTION', 'ERROR_DATA_TEXT');
					}
				);
			}

			function getBackground(locationwiseItem) {
				var background;
				if (locationwiseItem && !locationwiseItem.nodata) {
					var time = tools.getLocalTime(locationwiseItem.timezone);
					var condition = conditionMap[locationwiseItem.outlookCode];

					if (condition && condition.background) {
						background = condition.background;
					}
					else if (tools.isNightTime(time) && condition.backgrounds['night']) {
						background = condition.backgrounds['night'];
					}
					else {
						background = condition.backgrounds[tools.getSeason(time)];
					}
				}
				else {
					background = 'clear_summer.jpg';
				}
			
				return 'img/backgrounds/' + background;
			}

			$scope.updateBackground = function (locationwiseItem) {
				$scope.background = getBackground(locationwiseItem);
			};

			$scope.setMylocationsItems = function (mylocations) {
				$scope.mylocations = {
					locations: $scope.cloneLocations(mylocations.locations),
					defaultLocation: mylocations.defaultLocation,
				};
			};

			$scope.setSettingsItem = function (settingsData) {
				$scope.settings = $scope.createSettingsItem(settingsData);
			};

			$scope.createSettingsItem = function (settings) {
				return {
					defaultView: settings.defaultView || 0,
					temperature: settings.temperature || 0,
					time: settings.time || 0,
					alerts: settings.alerts || 0,
					windSpeed: settings.windSpeed || 0
				};
			};

			$scope.cloneLocations = function (locations) {
				var clone = [];
				angular.forEach(locations, function (location) {
					clone.push({ name: location.name, id: location.id });
				});
				return clone;
			};

			$scope.prepareLocationsData = function (locations, defaultLocation) {
				var data = {
					locations: [],
					defaultLocation: locations.length ? defaultLocation : null
				};

				angular.forEach(locations, function (location) {
					data.locations.push({ name: location.name, id: location.id });
				});
				return data;
			};

			$scope.prepareSettingsData = function (settings) {
				return {
					defaultView: settings.defaultView,
					temperature: settings.temperature,
					time: settings.time,
					alerts: settings.alerts,
					windSpeed: settings.windSpeed
				};
			};

			$scope.showFatalError = function (title, text) {
				controls.hideMessage();
				core.callController('ErrorCtrl', {
					show: true,
					title: localization.localize(title),
					text: localization.localize(text),
					callback: core.quit
				});
			};

			$scope.navigateApp = function (key) {
				if (keyboard.isPressed(key, keyboard.keys.EXIT, keyboard.keys.FP_EXIT)) {
					core.quit();
				}
				return false;
			};

			$timeout(function () {
				initialize();
			});
		}]);
})();
