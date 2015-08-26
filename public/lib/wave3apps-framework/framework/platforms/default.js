'use strict';

platform.add(function () {
	var exitUrl = document.referrer;

	return {
		name: 'Default',
		userAgent: '.',
		dependencies: [],

		initialize: function () { },

		print: function(method, message) {
			window.console[method](message);
		},

		mapKeys: function (keys, map) {
			var pcKeyboard = {
				CANCEL: 3,
				HELP: 6,
				BACK_SPACE: 8,
				TAB: 9,
				CLEAR: 12,
				RETURN: 13,
				ENTER: 14,
				SHIFT: 16,
				CONTROL: 17,
				ALT: 18,
				PAUSE: 19,
				CAPS_LOCK: 20,
				ESCAPE: 27,
				SPACE: 32,
				PAGE_UP: 33,
				PAGE_DOWN: 34,
				END: 35,
				HOME: 36,
				LEFT: 37,
				UP: 38,
				RIGHT: 39,
				DOWN: 40,
				PRINTSCREEN: 44,
				INSERT: 45,
				DELETE: 46,
				DIGIT_0: 48,
				DIGIT_1: 49,
				DIGIT_2: 50,
				DIGIT_3: 51,
				DIGIT_4: 52,
				DIGIT_5: 53,
				DIGIT_6: 54,
				DIGIT_7: 55,
				DIGIT_8: 56,
				DIGIT_9: 57,
				SEMICOLON: 59,
				EQUALS: 61,
				A: 65,
				B: 66,
				C: 67,
				D: 68,
				E: 69,
				F: 70,
				G: 71,
				H: 72,
				I: 73,
				J: 74,
				K: 75,
				L: 76,
				M: 77,
				N: 78,
				O: 79,
				P: 80,
				Q: 81,
				R: 82,
				S: 83,
				T: 84,
				U: 85,
				V: 86,
				W: 87,
				X: 88,
				Y: 89,
				Z: 90,
				CONTEXT_MENU: 93,
				NUMPAD_0: 96,
				NUMPAD_1: 97,
				NUMPAD_2: 98,
				NUMPAD_3: 99,
				NUMPAD_4: 100,
				NUMPAD_5: 101,
				NUMPAD_6: 102,
				NUMPAD_7: 103,
				NUMPAD_8: 104,
				NUMPAD_9: 105,
				MULTIPLY: 106,
				ADD: 107,
				SEPARATOR: 108,
				SUBTRACT: 109,
				DECIMAL: 110,
				DIVIDE: 111,
				F1: 112,
				F2: 113,
				F3: 114,
				F4: 115,
				F5: 116,
				F6: 117,
				F7: 118,
				F8: 119,
				F9: 120,
				F10: 121,
				F11: 122,
				F12: 123,
				F13: 124,
				F14: 125,
				F15: 126,
				F16: 127,
				F17: 128,
				F18: 129,
				F19: 130,
				F20: 131,
				F21: 132,
				F22: 133,
				F23: 134,
				F24: 135,
				NUM_LOCK: 144,
				SCROLL_LOCK: 145,
				COMMA: 188,
				PERIOD: 190,
				SLASH: 191,
				BACK_QUOTE: 192,
				OPEN_BRACKET: 219,
				BACK_SLASH: 220,
				CLOSE_BRACKET: 221,
				QUOTE: 222,
				META: 224
			};

			var espialKeyboard = {
				YELLOW: 326,
				BLUE: 323,
				RED: 324,
				GREEN: 325,
				EXIT: 420
			};

			map( keys.POWER, pcKeyboard.F12 );
			map( keys.PAUSE, pcKeyboard.A, pcKeyboard.PAUSE );
			map( keys.PLAY, pcKeyboard.Z );
			map( keys.STOP, pcKeyboard.X );
			map( keys.FAST_FORWARD, pcKeyboard.W );
			map( keys.FAST_REWIND, pcKeyboard.Q );
			map( keys.SKIP_FORWARDS, pcKeyboard.U );
			map( keys.SKIP_BACKWARDS, pcKeyboard.Y );
			map( keys.OK, pcKeyboard.ENTER, pcKeyboard.RETURN );
			map( keys.UP, pcKeyboard.UP );
			map( keys.DOWN, pcKeyboard.DOWN );
			map( keys.LEFT, pcKeyboard.LEFT );
			map( keys.RIGHT, pcKeyboard.RIGHT );
			map( keys.EXIT, pcKeyboard.ESCAPE, espialKeyboard.EXIT );
			map( keys.BACK, pcKeyboard.BACK_SPACE, pcKeyboard.HOME );
			map( keys.RECORD, pcKeyboard.R );
			map( keys.LIVE_TV, pcKeyboard.T );
			map( keys.INFO, pcKeyboard.F7 );
			map( keys.YELLOW, pcKeyboard.F3, espialKeyboard.YELLOW );
			map( keys.RED, pcKeyboard.F5, espialKeyboard.RED );
			map( keys.BLUE, pcKeyboard.F4, pcKeyboard.B, espialKeyboard.BLUE );
			map( keys.GREEN, espialKeyboard.GREEN );
			map( keys.MUTE, pcKeyboard.F8 );
			map( keys.VOLUME_UP, pcKeyboard.F10 );
			map( keys.VOLUME_DOWN, pcKeyboard.F9 );
			map( keys.CHANNEL_UP, pcKeyboard.PAGE_UP );
			map( keys.CHANNEL_DOWN, pcKeyboard.PAGE_DOWN );
			map( keys.JUMP, pcKeyboard.J );
			map( keys.MENU, pcKeyboard.M );
			map( keys.PHONE );
			map( keys.VOD, pcKeyboard.V );
			map( keys.LIST, pcKeyboard.D, pcKeyboard.P );
			map( keys.GUIDE, pcKeyboard.G );
			map( keys.TV_VIDEO_TOGGLE );
			map( keys.HASH, pcKeyboard.F2 );
			map( keys.ASTERISK );
			map( keys.DAY_UP );
			map( keys.DAY_DOWN );
			map( keys.MEDIA_REPLAY );
			map( keys.SETTINGS, pcKeyboard.S );
			map( keys.PIP_TOGGLE, pcKeyboard.L );
			map( keys.PIP_SWAP, pcKeyboard.E );
			map( keys.PIP_MOVE, pcKeyboard.C );
			map( keys.PIP_CHANNEL_UP, pcKeyboard.K );
			map( keys.PIP_CHANNEL_DOWN, pcKeyboard.N );
			map( keys.PIP_VIDEO_SOURCE );
			map( keys.FAVORITES, pcKeyboard.F );
			map( keys.DIGIT_0, pcKeyboard.DIGIT_0, pcKeyboard.NUMPAD_0 );
			map( keys.DIGIT_1, pcKeyboard.DIGIT_1, pcKeyboard.NUMPAD_1 );
			map( keys.DIGIT_2, pcKeyboard.DIGIT_2, pcKeyboard.NUMPAD_2 );
			map( keys.DIGIT_3, pcKeyboard.DIGIT_3, pcKeyboard.NUMPAD_3 );
			map( keys.DIGIT_4, pcKeyboard.DIGIT_4, pcKeyboard.NUMPAD_4 );
			map( keys.DIGIT_5, pcKeyboard.DIGIT_5, pcKeyboard.NUMPAD_5 );
			map( keys.DIGIT_6, pcKeyboard.DIGIT_6, pcKeyboard.NUMPAD_6 );
			map( keys.DIGIT_7, pcKeyboard.DIGIT_7, pcKeyboard.NUMPAD_7 );
			map( keys.DIGIT_8, pcKeyboard.DIGIT_8, pcKeyboard.NUMPAD_8 );
			map( keys.DIGIT_9, pcKeyboard.DIGIT_9, pcKeyboard.NUMPAD_9 );
		},

		showKeyboard: function (element) {
			//this.print('debug', 'showing virtual keyboard for: ' + element.id);
		},

		hideKeyboard: function (element) {
			//this.print('debug', 'hiding virtual keyboard for: ' + element.id);
		},

		quit: function () {
			window.location.href = exitUrl;
		}
	};
});