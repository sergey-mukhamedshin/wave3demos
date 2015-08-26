(function () {
	'use strict';

	angular.module('localization').run(['resources', function (resources) {
		resources['en-CA'] = {
			HEADER_TRAFFIC: 'Traffic',
			HEADER_ADD: 'Add Destination',

			MONDAY: 'monday',
			TUESDAY: 'tuesday',
			WEDNESDAY: 'wednesday',
			THURSDAY: 'thursday',
			FRIDAY: 'friday',
			SATURDAY: 'saturday',
			SUNDAY: 'sunday',

			JANUARY: 'january',
			FEBRUARY: 'february',
			MARCH: 'march',
			APRIL: 'april',
			MAY: 'may',
			JUNE: 'june',
			JULY: 'july',
			AUGUST: 'august',
			SEPTEMBER: 'september',
			OCTOBER: 'october',
			NOVEMBER: 'november',
			DECEMBER: 'december',

			'AM': 'am',
			'PM': 'pm',

			MAP_MODE: 'map mode',
			ADD_DESTINATION: 'add destination',
			MANAGE_DESTINATIONS: 'manage destinations',
			CENTER_MAP: 'center map to home',
			SELECT_DESTINATION: 'select destination',
			BACK_TO_MAP: 'back to map',

			BUTTON_ADD: 'Add',
			BUTTON_HOME: 'Home',
			BUTTON_NEXT: 'Next',
			BUTTON_SKIP: 'Skip',
			BUTTON_ADD_DESTINATION: 'Add destination',
			BUTTON_GO_TO_MAP: 'Go to Map',
			BUTTON_SAVE_NAME: 'Save Name',
			BUTTON_CANCEL: 'Cancel',
			BUTTON_DELETE: 'Delete',
			BUTTON_OK: 'OK',
			BUTTON_QUIT: 'Quit',

			WELCOME_INTRODUCTION_TITLE: 'Welcome to Eclipse Traffic',
			WELCOME_INTRODUCTION_TRAFFIC: 'With Eclipse Traffic you can browse real time traffic conditions.',
			WELCOME_INTRODUCTION_SAVE: 'With this easy to use app you can also save up to four destinations to quickly access and assess your frequent travel routes.',

			WELCOME_NAVIGATE_TITLE: 'Navigating the map',
			WELCOME_NAVIGATE_HOWTO: 'How to use your Eclipse controller to navigate',
			WELCOME_NAVIGATE_PAN: 'Use arrow keys to pan around the map',
			WELCOME_NAVIGATE_ZOOM: 'Use page up and page down to zoom',

			WELCOME_SAVE_TITLE: 'Save Frequent Destinations',
			WELCOME_SAVE_TEXT: 'Save a destination that you travel to frequently to easily view traffic conditions later.',

			PREDEFINED_WORK: 'Work',
			PREDEFINED_SCHOOL: 'School',
			PREDEFINED_STORE: 'Store',
			PREDEFINED_FAMILY: 'Family',
			PREDEFINED_TRAVEL: 'Travel',

			CONDITION_UNKNOWN: 'Unknown conditions',
			CONDITION_GOOD: 'Moving Well',
			CONDITION_BUSY: 'Busy Roads',
			CONDITION_SLOW: 'Slow Traffic',
			CONDITION_DELAYS: 'Expect Delays',

			NAVIGATION_INSTRUCTIONS: 'Zoom and pan to find a destination. Press "OK" to select.',

			PREDEFINED_TITLE: 'Name Your New Destination',
			CUSTOM_LABEL_BUTTON: 'Create Custom Label',

			CUSTOM_LABEL_TITLE: 'Enter Your Custom Label',
			TEXT_ENTER_HINT: 'Enter destination name',

			CUSTOM_ICON_TITLE: 'Choose an Icon',

			PREVIEW_TITLE: 'How does this look?',

			PREVIEW_ICON: 'Icon:',
			PREVIEW_LABEL: 'Label:',

			DELETE_CONFIRM: 'Are you sure you want to delete',

			MESSAGE_LOADING: "Loading...",
			MESSAGE_SAVING: "Saving...",

			"ERROR_UNKNOWN_PLATFORM": "Platform is unknown or not supported (TR-01)",
			"ERROR_PLATFORM_LOADING": "Server software problem (TR-02)",
			"ERROR_REQUESTING_LANGUAGE": "System can't define current language (TR-03)",
			"ERROR_INITIALIZING_MAP": "System can't connect to Maps services (TR-04)",
			"ERROR_LOADING_ROUTES": "System can't get routes from server (TR-05)",
			//"ERROR_DEFINE_LOCATION": "System can't  define your location (TR-06)",
			//"ERROR_SAVING_NEW_ROUTE": "System can't save the route (TR-08)",
			"ERROR_LOADING_DIRECTIONS": "Can’t find the route to destination %s, please try again later",
			"ERROR_SAVING_ROUTES": "System can't save the route (TR-10)",
			//"ERROR_REQUESTING_SUGGESTIONS": "System can't define requested location (TR-11)"
		};
	}]);
})();