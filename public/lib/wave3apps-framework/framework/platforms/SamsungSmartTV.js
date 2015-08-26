'use strict';

platform.add(function () {
	var imes = {};
	var widgetAPI;
	var pluginAPI;

	function createInstance(element, OnTextChanged) {
		return {
			enabled: false,
			ime: new IMEShell(element.id,
				function (imeObject) {
					imeObject.setQWERTYPos(0, 0);
					imeObject.setWordBoxPos(18, 6);
					imeObject.setOnCompleteFunc(
						function (newText) {
							if (OnTextChanged)
								OnTextChanged(newText);
						}
					);
					imeObject.setOnFocusFunc(function () {
						if (!imes[element.id].enabled) {
							imes[element.id].ime._blur();
						}
					});
				},
				'en'
			),
		};
	}

	return {
		name: 'Samsung Smart TV',
		userAgent: 'SMART-TV',
		dependencies: [
			'$MANAGER_WIDGET/Common/API/Widget.js',
			'$MANAGER_WIDGET/Common/API/Plugin.js',
			'$MANAGER_WIDGET/Common/API/TVKeyValue.js',
			'$MANAGER_WIDGET/Common/Util/Include.js',
			'$MANAGER_WIDGET/Common/Util/Language.js',
			'$MANAGER_WIDGET/Common/Plugin/Define.js',
			'$MANAGER_WIDGET/Common/IME/ime2.js'
		],

		initialize: function () {
			widgetAPI = new Common.API.Widget();
			pluginAPI = new Common.API.Plugin();

			pluginAPI.registIMEKey();
			widgetAPI.sendReadyEvent();
		},

		print: function (method, message) {
			window.alert(message);
		},

		mapKeys: function (keys, map) {
			var tvKey = new Common.API.TVKeyValue();

			map( keys.POWER, tvKey.KEY_POWER );
			map( keys.PAUSE, tvKey.KEY_PAUSE );
			map( keys.PLAY, tvKey.KEY_PLAY );
			map( keys.STOP, tvKey.KEY_STOP );
			map( keys.FAST_FORWARD, tvKey.KEY_FF );
			map( keys.FAST_REWIND, tvKey.KEY_RW );
			map( keys.SKIP_FORWARDS );
			map( keys.SKIP_BACKWARDS );
			map( keys.OK, tvKey.KEY_ENTER );
			map( keys.UP, tvKey.KEY_UP );
			map( keys.DOWN, tvKey.KEY_DOWN );
			map( keys.LEFT, tvKey.KEY_LEFT );
			map( keys.RIGHT, tvKey.KEY_RIGHT );
			map( keys.EXIT, tvKey.KEY_EXIT );
			map( keys.BACK, tvKey.KEY_RETURN );
			map( keys.RECORD, tvKey.KEY_REC );
			map( keys.LIVE_TV );
			map( keys.INFO, tvKey.KEY_INFO );
			map( keys.YELLOW, tvKey.KEY_YELLOW );
			map( keys.RED, tvKey.KEY_RED );
			map( keys.BLUE, tvKey.KEY_BLUE );
			map( keys.GREEN, tvKey.KEY_GREEN );
			map( keys.MUTE, tvKey.KEY_MUTE );
			map( keys.VOLUME_UP, tvKey.KEY_VOL_UP );
			map( keys.VOLUME_DOWN, tvKey.KEY_VOL_DOWN);
			map( keys.CHANNEL_UP, tvKey.KEY_CH_UP );
			map( keys.CHANNEL_DOWN, tvKey.KEY_CH_DOWN );
			map( keys.JUMP, tvKey.KEY_PRECH );
			map( keys.MENU, tvKey.KEY_MENU );
			map( keys.PHONE );
			map( keys.VOD );
			map( keys.LIST, tvKey.KEY_CHLIST );
			map( keys.GUIDE, tvKey.KEY_GUIDE );
			map( keys.TV_VIDEO_TOGGLE, tvKey.KEY_SOURCE );
			map( keys.HASH );
			map( keys.ASTERISK );
			map( keys.DAY_UP );
			map( keys.DAY_DOWN );
			map( keys.MEDIA_REPLAY );
			map( keys.SETTINGS, tvKey.KEY_TOOLS );
			map( keys.PIP_TOGGLE );
			map( keys.PIP_SWAP );
			map( keys.PIP_MOVE );
			map( keys.PIP_CHANNEL_UP );
			map( keys.PIP_CHANNEL_DOWN );
			map( keys.PIP_VIDEO_SOURCE );
			map( keys.FAVORITES, tvKey.KEY_FAVCH );
			map( keys.DIGIT_0, tvKey.KEY_0 );
			map( keys.DIGIT_1, tvKey.KEY_1 );
			map( keys.DIGIT_2, tvKey.KEY_2 );
			map( keys.DIGIT_3, tvKey.KEY_3 );
			map( keys.DIGIT_4, tvKey.KEY_4 );
			map( keys.DIGIT_5, tvKey.KEY_5 );
			map( keys.DIGIT_6, tvKey.KEY_6 );
			map( keys.DIGIT_7, tvKey.KEY_7 );
			map( keys.DIGIT_8, tvKey.KEY_8 );
			map( keys.DIGIT_9, tvKey.KEY_9 );
			map( keys.FP_POWER, tvKey.KEY_PANEL_POWER );
			map( keys.FP_CHANNEL_UP, tvKey.KEY_PANEL_CH_UP );
			map( keys.FP_CHANNEL_DOWN, tvKey.KEY_PANEL_CH_DOWN );
			map( keys.FP_VOLUME_UP, tvKey.KEY_PANEL_VOL_UP );
			map( keys.FP_VOLUME_DOWN, tvKey.KEY_PANEL_VOL_DOWN );
			map( keys.FP_SELECT, tvKey.KEY_PANEL_ENTER );
			map( keys.FP_EXIT );
			map( keys.FP_INFO );
			map( keys.FP_GUIDE );
			map( keys.FP_LIST );
			map( keys.FP_SETTINGS );
		},

		showKeyboard: function (element, OnTextChanged) {
			element.blur();
			if (!imes[element.id])
				imes[element.id] = createInstance(element, OnTextChanged);

			imes[element.id].enabled = true;
			element.focus();
		},

		hideKeyboard: function (element) {
			if (imes[element.id]) {
				imes[element.id].enabled = false;
				imes[element.id].ime._blur();
			}
		},

		quit: function () {
			widgetAPI.sendReturnEvent();
		}
	};
});