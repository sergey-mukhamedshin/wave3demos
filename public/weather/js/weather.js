(function () {
	'use strict';

	angular.module('weatherApp').controller('WeatherCtrl',
		['$scope', '$timeout', '$interval', '$filter', '$element', '$window', 'core', 'console', 'keyboard', 'controls', 'localization', 'tools', 'dataProvider',
		function ($scope, $timeout, $interval, $filter, $element, $window, core, console, keyboard, controls, localization, tools, dataProvider) {
			var content = core.get('weather-content');
			var arrowUp = core.get('weather-up');
			var arrowDown = core.get('weather-down');
			var todayStyle = getComputedStyle(core.get('today'));
			var scrollStep = parseInt(todayStyle.marginTop) + parseInt(todayStyle.height);
			var fdate = $filter('date');
			var reloadTimeout;
			var clockInterval;
			var selectedLocation;
			var locationsData, weeklyData, hourlyData;
			var CLOCK_INTERVAL = 1000;
			var MAX_ALERT_HEADLINE = 80;

			core.registerController('WeatherCtrl', function (args) {
				selectedLocation = parseInt(localStorage.currentCity);
				if (isNaN(selectedLocation))
					selectedLocation = 0;

				if (selectedLocation < 0)
					selectedLocation = 0;
				else if (selectedLocation >= $scope.mylocations.locations.length)
					selectedLocation = $scope.mylocations.locations.length - 1;

				load(true);
			});

			function load(clearData) {
				if (clearData) {
					locationsData = undefined;
					weeklyData = undefined;
					hourlyData = undefined;
				}

				var locationItem = $scope.mylocations.locations[selectedLocation];

				hideContent();
				hideArrows();
				cancelRefresh();

				controls.showMessage(localization.localize('POPUP_TEXT_LOADING'));
				dataProvider.locationwise($scope.mylocations.locations).then(
					function (data) {
						locationsData = data;
						
						dataProvider.weekly(locationItem.id).then(
							function (data) {
								weeklyData = data;
								dataProvider.hourly(locationItem.id, weeklyData[0].date).then(
									function (data) {
										hourlyData = data;
										show();
									},
									showLoadDataError
								);
							},
							showLoadDataError
						);

					},
					showLoadDataError
				);
			}

			function show() {
				var locationItem = $scope.mylocations.locations[selectedLocation];
				localStorage.currentCity = selectedLocation;

				core.show($element);
				$scope.currentCity = prepareWeatherData(locationItem, locationsData, weeklyData, hourlyData);
				$scope.updateBackground($scope.currentCity);

				$scope.itemIndex = selectedLocation;
				$timeout(function () {
					controls.hideMessage();
					showContent();
					content.scrollTop = 0;
					updateArrows();
					controls.focus($element[0])
				});

				runClock();
				scheduleRefresh();
			}

			function formatHour(hour) {
				if ($scope.settings.time === dataProvider.AMPM) {
					var period = localization.localize(hour < 12 ? 'am' : 'pm');
					hour = hour % 12;
					if (hour == 0) hour = 12;
					return hour + ' ' + period;
				}
				else {
					return hour + ':00';
				}
			}

			function prepareWeatherData(location, locationsData, weeklyData, hourlyData) {
				var city = {};
				city.id = location.id;
				city.name = location.name;

				var locationData = getLocationwise(location, locationsData);
				if (!locationData || !weeklyData || !hourlyData) {
					city.nodata = true;
					return city;
				}

				city.timezone = locationData.timeZone;
				city.outlookCode = locationData.outlook;
				city.outlook = getOutlook(locationData.outlook);
				city.outlookIcon = getOutlookIcon(locationData.outlook, tools.getLocalTime(locationData.timeZone));
				city.temperature = getTemperature(locationData.temperature);
				city.feelsLike = getTemperature(locationData.feelsLike);

				var precipitationType = tools.fahrenheit2celsius(locationData.temperature) > 0 ? 'OUTLOOK_RAIN' : 'OUTLOOK_SNOW';
				city.precipitationType = localization.localize(precipitationType);

				if (locationData && locationData.alerts) {
					city.alerts = [];
					for (var i = 0; i < locationData.alerts.length; ++i) {
						if (locationData.alerts[i].language == Config.language) {
							var alert = locationData.alerts[i];

							var headline, description;
							if (alert.headline && alert.description) {
								headline = alert.headline;
								description = alert.description;
							}
							else if (!alert.headline && alert.description) {
								headline = description = alert.description;
							}
							else if (alert.headline && !alert.description) {
								headline = description = alert.headline;
							}
							else {
								//TODO: use localized version
								headline = description = "The following event is expected: " + alert.event + ", urgency: "
									+ alert.urgency + ", severity: " + alert.severity + ", certainty: " + alert.certainty;
							}

							if (headline.length > MAX_ALERT_HEADLINE)
								headline = headline.substr(0, MAX_ALERT_HEADLINE) + '...';

							city.alerts.push({
								headline: headline,
								description: description
							});
							
							if (city.alerts.length >= Config.maximumNumberOfAlerts)
								break;
						}
					}
				}

				city.weekly = [];
				for (var i = 0; i < weeklyData.length; ++i) {
					var d = weeklyData[i].date.split('/');
					var date = new Date(d[0], d[1], d[2]);
					
					city.weekly.push({
						date: weeklyData[i].date,
						outlook: getOutlook(weeklyData[i].outlook),
						outlookIcon: getOutlookIcon(weeklyData[i].outlook),
						temperature: getTemperature(weeklyData[i].temperature),
						high: getTemperature(weeklyData[i].highTemp),
						low: getTemperature(weeklyData[i].lowTemp),
						pop: weeklyData[i].pop,
						dayFormatted: localization.localize(fdate(date, 'EEEE'))
					});
				}

				city.hourly = [];
				for (var i = 0; i < hourlyData.length && i < 10; ++i) {
					city.hourly.push({
						hourly: hourly,
						outlook: getOutlook(hourlyData[i].outlook),
						temperature: getTemperature(hourlyData[i].temperature),
						feelsLike: getTemperature(hourlyData[i].feelsLike),
						humidity: hourlyData[i].humidity,
						pop: hourlyData[i].pop,
						hour: formatHour(hourlyData[i].hour),
						outlookIcon: getOutlookIcon(hourlyData[i].outlook, date)
					});
				}

				return city;
			}

			function hideContent() {
				core.hide(content);
			}

			function showContent() {
				core.show(content);
			}

			function hideArrows() {
				core.hide(arrowUp);
				core.hide(arrowDown);
			}

			function updateArrows() {
				hideArrows();

				if (content.scrollHeight - content.scrollTop > content.clientHeight)
					core.show(arrowDown);
				if (content.scrollTop > 0)
					core.show(arrowUp);
			}

			function scroll(to) {
				var element = $(content);
				if (!element.is(':animated')) {
					element.animate({ 'scrollTop': to }, { 'easing': 'linear', 'duration': 1000, 'complete': updateArrows });
				}
			}

			function errorClosed() {
				controls.focus($element[0]);
			}

			function showError(title, text, hint, callback) {
				controls.hideMessage();
				cancelClock();
				cancelRefresh();

				core.callController('ErrorCtrl', {
					show: true,
					title: localization.localize(title),
					text: localization.localize(text),
					hint: localization.localize(hint),
					keyHandlers: [{
						key: keyboard.keys.OK,
						handler: callback
					}],
					callback: callback
				});
			};

			function showLoadDataError() {
				if (!locationsData || !weeklyData || !hourlyData)
					showError('ERROR_DATA_CAPTION', 'ERROR_DATA_TEXT', 'ERROR_RETURN_HINT', show);
				else
					showError('ERROR_REFRESH_CAPTION', 'ERROR_REFRESH_TEXT', 'ERROR_RETURN_HINT', show);
			}

			function showSaveError() {
				showError('ERROR_SAVE_CAPTION', 'ERROR_DATA_TEXT', 'ERROR_RETURN_HINT', show);
			}

			function scheduleRefresh() {
				console.log('schedule refresh');
				reloadTimeout = $timeout(function () {
					console.log('start refreshing');
					$timeout.cancel(reloadTimeout);
					reloadTimeout = undefined;
					load();
				}, Config.updateInterval * 1000);
			}

			function cancelRefresh() {
				if (angular.isDefined(reloadTimeout)) {
					console.log('cancel refresh');
					$timeout.cancel(reloadTimeout);
					reloadTimeout = undefined;
				}
			}

			function updateClock() {
				var localTime = tools.getLocalTime($scope.currentCity.timezone);
				var day = localization.localize(fdate(localTime, 'EEEE'));
				var month = localization.localize(fdate(localTime, 'MMMM'));

				var date = fdate(localTime, 'd');
				var time = ($scope.settings.time === dataProvider.AMPM) ?
					fdate(localTime, 'h:mm') + localization.localize(fdate(localTime, 'a')) : fdate(localTime, 'H:mm');

				var timeFormatted = day + ', ' + month + ' ' + date + ' ' + time;
				$scope.localTime = timeFormatted;
			}

			function runClock() {
				if (clockInterval) {
					cancelClock();
				}
				updateClock();
				clockInterval = $interval(updateClock, CLOCK_INTERVAL);
			};
			
			function cancelClock() {
				if (angular.isDefined(clockInterval)) {
					$interval.cancel(clockInterval);
					clockInterval = undefined;
				}
			}

			function getLocationwise(location, locationwise) {
				var result;
				if (locationwise) {
					for (var i = 0; i < locationwise.length; ++i) {
						if (locationwise[i].location === location.id) {
							result = locationwise[i];
							break;
						}
					}
				}
				return result;
			}

			function getOutlook(outlook) {
				var condition = conditionMap[outlook || 0];
				return localization.localize(condition.phrase);
			}

			function getOutlookIcon(outlook, time) {
				var icon;
				var condition = conditionMap[outlook || 0];
				if (condition.icons) {
					icon = condition.icons[tools.isNightTime(time) ? 'night' : 'day'];
				}
				else {
					icon = condition.icon;
				}
				return 'img/icons/' + icon;
			}

			function getTemperature(temperature) {
				if ($scope.settings && $scope.settings.temperature === dataProvider.CELSIUS) {
					return tools.fahrenheit2celsius(temperature);
				}
				return temperature;
			}

			function onSettingsClosed(locations, settings, save) {
				if (save) {
					var locationsData = $scope.prepareLocationsData(locations, 0);
					var settingsData = $scope.prepareSettingsData(settings);

					hideArrows();
					hideContent();
					controls.showMessage(localization.localize('POPUP_TEXT_SAVING'));
					dataProvider.saveSettings(settingsData).then(
						function () {
							dataProvider.saveLocations(locationsData).then(
								function () {
									$scope.setSettingsItem(settingsData);
									$scope.setMylocationsItems(locationsData);

									if ($scope.mylocations.locations.length == 0) {
										controls.hideMessage();
										showAddLocation();
									}
									else {
										selectedLocation = 0;
										load(true);
									}
								},
								showSaveError
							);
						},
						showSaveError
					);
				}
				else {
					show();
				}
			}

			function showSettings() {
				cancelClock();
				cancelRefresh();
				core.callController('SettingsCtrl', { callback: onSettingsClosed });
			}

			function onAddLocationClosed(locations, newLocation) {
				if (newLocation) {
					var locationsData = $scope.prepareLocationsData(locations, 0);

					controls.showMessage(localization.localize('POPUP_TEXT_SAVING'));
					dataProvider.saveLocations(locationsData).then(
						function () {
							$scope.setMylocationsItems(locationsData);
							selectedLocation = locations.indexOf(newLocation);
							load(true);
						},
						showSaveError
					);
				}
				else {
					show();
				}
			}

			function showAddLocation() {
				cancelClock();
				cancelRefresh();
				core.hide($element);
				core.callController('AddCityCtrl', { callback: onAddLocationClosed });
			}

			$scope.addCity = function (key) {
				if (keyboard.isPressed(key, keyboard.keys.OK)) {
					showAddLocation();
					return true;
				}
			};

			$scope.navigate = function (key) {
				if (keyboard.isPressed(key, keyboard.keys.YELLOW)) {
					showAddLocation();
					return true;
				}

				if (keyboard.isPressed(key, keyboard.keys.BLUE)) {
					showSettings();
					return true;
				}

				if (keyboard.isPressed(key, keyboard.keys.UP)) {
					scroll(content.scrollTop - scrollStep);
					return true;
				}
				if (keyboard.isPressed(key, keyboard.keys.DOWN)) {
					scroll(content.scrollTop + scrollStep);
					return true;
				}

				return false;
			};

			$scope.itemChanged = function (index) {
				$scope.itemIndex = index - 1;
			};

			$scope.selectCity = function (key, locationIndex) {
				if (keyboard.isPressed(key, keyboard.keys.OK)) {
					selectedLocation = locationIndex;
					load(true);
					return true;
				}
				return false;
			};

			$scope.rescrollMenu = function (element) {
				var domElement = element[0];
				var parent = domElement.parentNode;


				$timeout(function () {
					if (domElement.offsetLeft < parent.scrollLeft) {
						parent.scrollLeft = domElement.offsetLeft;
					}
					else if (domElement.offsetLeft + domElement.offsetWidth > parent.clientWidth + parent.scrollLeft) {
						parent.scrollLeft = domElement.offsetLeft + domElement.offsetWidth - parent.clientWidth;
					}
				});
			};

			angular.element($window).bind('resize', function () {
				todayStyle = getComputedStyle(core.get('today'));
				scrollStep = parseInt(todayStyle.marginTop) + parseInt(todayStyle.height);
			});
		}]);
})();
