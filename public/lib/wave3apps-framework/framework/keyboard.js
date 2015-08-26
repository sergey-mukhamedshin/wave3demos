'use strict';

angular.module('keyboard', ['logging']).service('keyboard', ['console', function (console) {
	var keys = {
		POWER: [],
		PAUSE: [],
		PLAY: [],
		STOP: [],
		FAST_FORWARD: [],
		FAST_REWIND: [],
		SKIP_FORWARDS: [],
		SKIP_BACKWARDS: [],
		OK: [],
		UP: [],
		DOWN: [],
		LEFT: [],
		RIGHT: [],
		RECORD: [],
		EXIT: [],
		BACK: [],
		LIVE_TV: [],
		INFO: [],
		YELLOW: [],
		RED: [],
		BLUE: [],
		GREEN: [],
		MUTE: [],
		VOLUME_UP: [],
		VOLUME_DOWN: [],
		CHANNEL_UP: [],
		CHANNEL_DOWN: [],
		JUMP: [],
		MENU: [],
		PHONE: [],
		VOD: [],
		LIST: [],
		GUIDE: [],
		TV_VIDEO_TOGGLE: [],
		HASH: [],
		ASTERISK: [],
		DAY_UP: [],
		DAY_DOWN: [],
		MEDIA_REPLAY: [],
		SETTINGS: [],
		PIP_TOGGLE: [],
		PIP_SWAP: [],
		PIP_MOVE: [],
		PIP_CHANNEL_UP: [],
		PIP_CHANNEL_DOWN: [],
		PIP_VIDEO_SOURCE: [],
		FAVORITES: [],
		DIGIT_0: [],
		DIGIT_1: [],
		DIGIT_2: [],
		DIGIT_3: [],
		DIGIT_4: [],
		DIGIT_5: [],
		DIGIT_6: [],
		DIGIT_7: [],
		DIGIT_8: [],
		DIGIT_9: [],
		FP_POWER: [],
		FP_CHANNEL_UP: [],
		FP_CHANNEL_DOWN: [],
		FP_VOLUME_UP: [],
		FP_VOLUME_DOWN: [],
		FP_SELECT: [],
		FP_EXIT: [],
		FP_INFO: [],
		FP_GUIDE: [],
		FP_LIST: [],
		FP_SETTINGS: []
	};

	console.info('mapping keyboard...');

	platform.mapKeys(keys, function (key /*, inputKeys */) {
		for (var i = 1; i < arguments.length; ++i) {
			var inputKey = arguments[i];
			/* Uncomment this to verify mapping
			for (var j in keys) {
				if (keys[j].indexOf(inputKey) != -1) {
					console.stack();
					throw 'Key ' + inputKey + ' mapped more than once!';
				}
			}
			*/
			key.push(inputKey);
		}
	});

	console.info('keyboard mapped');

	return {
		keys: keys,

		isPressed: function (inputKey /*, keys */) {
			for (var i = 1; i < arguments.length; ++i) {
				var key = arguments[i];
				if (key.indexOf(inputKey) != -1)
					return true;
			}
			return false;
		}
	};
}]);