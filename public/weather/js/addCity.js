(function () {
	'use strict';

	/*global Config*/

	angular.module('weatherApp').controller('AddCityCtrl',
		['$scope', '$timeout', '$interval', '$element', 'core', 'console', 'keyboard', 'focusable', 'controls', 'task', 'localization', 'dataProvider',
		function ($scope, $timeout, $interval, $element, core, console, keyboard, focusable, controls, task, localization, dataProvider) {
			var content = core.get('add-city-content');
			var addLocation = core.get('add-location');
			var keyboardButtons = core.get('keyboard');
			var suggestionList = core.get('suggestions');
			var noSuggestions = core.get('nomatches');
			var arrowUp = core.get('suggestions-up');
			var arrowDown = core.get('suggestions-down');
			var backButton = core.get('back');
			var cursorInterval;
			var callback;
			var newLocation;

			var CURSOR_INTERVAL = 1000;
			var MAX_LOCATION_LENGTH = 23;

			core.registerController('AddCityCtrl', function (args) {
				$scope.suggestions = [];
				callback = args.callback;
				newLocation = undefined;
				updateArrows();
				show();
			});

			function hideArrows() {
				core.hide(arrowUp);
				core.hide(arrowDown);
			}

			function updateArrows() {
				$timeout(function () {
					hideArrows();
					if (core.isVisible(suggestionList)) {
						if (suggestionList.scrollHeight - suggestionList.scrollTop > suggestionList.clientHeight)
							core.show(arrowDown);
						if (suggestionList.scrollTop > 0)
							core.show(arrowUp);
					}
				});
			}

			function updateBackButton() {
				if ($scope.locations.length == 0)
					core.hide(backButton);
				else
					core.show(backButton);
			}
			
			function getCity(locationName) {
				return locationName.split(',')[0];
			}

			function showSuggestions() {
				if ($scope.suggestions.length > 0) {
					core.hide(noSuggestions);
					core.show(suggestionList);
					updateArrows();
				}
				else {
					suggestionList.scrollTop = 0;
					updateArrows();
					core.hide(suggestionList);
					core.show(noSuggestions);
				}
			}

			function hideSuggestions() {
				task.ignore('locationSuggestions');
				suggestionList.scrollTop = 0;
				updateArrows();
				core.hide(suggestionList);
				core.hide(noSuggestions);
			}

			function errorClosed() {
				core.show(content);
				updateArrows();
				startCursorBlinking();
				$timeout(function () {
					controls.focus($element[0]);
				});
			}

			function showLoadDataError() {
				hideArrows();
				core.hide(content);
				cancelCursorBlinking();

				core.callController('ErrorCtrl', {
					show: true,
					title: localization.localize('ERROR_DATA_CAPTION'),
					text: localization.localize('ERROR_DATA_TEXT'),
					hint: localization.localize('ERROR_RETURN_HINT'),
					keyHandlers: [{
						key: keyboard.keys.OK,
						handler: errorClosed
					}],
					callback: errorClosed
				});
			}

			function updateSuggestions(search) {
				if (search.length < Config.minimumAddressLengthToSearch) {
					hideSuggestions();
					return;
				}

				focusable.resetCurrent(suggestionList);
				task.runOnlyLast('locationSuggestions', dataProvider.locationSuggestions(search, dataProvider.SUGGESTION_LOCATION)).then(
					function (data) {
						$scope.suggestions = data;
						showSuggestions();
					},
					showLoadDataError
				);
			}

			function show() {
				$scope.locations = $scope.cloneLocations($scope.mylocations.locations);
				$scope.newLocationName = core.doNotWatch('');
				updateBackButton();
				core.show($element);
				startCursorBlinking();
				$scope.itemIndex = 0;
				$timeout(function () {
					controls.focus(keyboardButtons);
				});
			}

			function hide() {
				cancelCursorBlinking();
				hideSuggestions();
				core.hide($element);

				if (callback)
					callback($scope.locations, newLocation);
			}

			function toggleCursor(text) {
				if (text[text.length - 1] == '_')
					return text.substr(0, text.length - 1);
				else
					return text + '_';
			}

			function removeCursor(text) {
				if (text[text.length - 1] == '_')
					return text.substr(0, text.length - 1);
				else
					return text;
			}

			function updateCursor() {
				$scope.newLocationName = core.doNotWatch(toggleCursor($scope.newLocationName));
			}

			function startCursorBlinking() {
				if (cursorInterval)
					cancelCursorBlinking();

				cursorInterval = $interval(updateCursor, CURSOR_INTERVAL);
			};

			function cancelCursorBlinking() {
				$scope.newLocationName = core.doNotWatch(removeCursor($scope.newLocationName));
				if (angular.isDefined(cursorInterval)) {
					$interval.cancel(cursorInterval);
					cursorInterval = undefined;
				}
			}

			$scope.onBack = function (key) {
				if (keyboard.isPressed(key, keyboard.keys.OK)) {
					hide();
					return true;
				}
				return false;
			};

			$scope.navigate = function (key) {
				if (keyboard.isPressed(key, keyboard.keys.BACK) && core.isVisible(backButton)) {
					hide();
					return true;
				}
				return false;
			};

			$scope.itemChanged = function (index) {
				$scope.itemIndex = index - 2;
			};

			$scope.onSuggestionFocused = function (element) {
				updateArrows();
			};

			$scope.selectSuggestion = function (key, suggestion) {
				if (keyboard.isPressed(key, keyboard.keys.OK)) {
					$scope.newLocationName = core.doNotWatch(suggestion.name);
					newLocation = { id: suggestion.id, name: getCity(suggestion.name) }
					$scope.locations.push(newLocation);
					hide();
					return true;
				}
				return false;
			};

			$scope.inputCity = function (key, letter) {
				if (keyboard.isPressed(key, keyboard.keys.OK)) {
					var currentText = removeCursor($scope.newLocationName);
					if (currentText.length > MAX_LOCATION_LENGTH && letter != 'backspace')
						return false;

					if (letter == 'backspace') {
						if (currentText.length > 0)
							currentText = currentText.substr(0, currentText.length - 1);
					}
					else {
						currentText = currentText + letter;
					}
					$scope.newLocationName = currentText;
					updateSuggestions(currentText);
					return true;
				}
				return false;
			};

			angular.element(keyboardButtons).bind('focus', function () {
				startCursorBlinking();
			});

			angular.element(suggestionList).bind('focus', function () {
				cancelCursorBlinking();
			});
		}]);
})();
