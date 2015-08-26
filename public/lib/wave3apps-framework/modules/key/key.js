(function (Common) {
  'use strict';

  var module = angular.module('key', ['activeManager']);

  module.factory('key', function () {
    return (/SMART-TV/.test(window.navigator.userAgent) ? smarttvKeyboard() : pcKeyboard());
  });

  module.run(['$document', 'activeManager', function ($document, activeManager) {
    $document.on('keydown', function (e) {
      var code = e.keyCode;
      var stopPropagation = false;
      var scope = activeManager.getActive();

			function exec(listener) {
				if (listener(e, code))
					stopPropagation = true;
			}

      while (scope) {
        if (scope.$$transcluded)
          scope = scope.$$prevSibling;

        if (scope.$$listeners[code]) {
          angular.forEach(scope.$$listeners[code], exec);

          scope.$digest();
        }

        if (stopPropagation) {
          e.preventDefault();
          break;
        }
        else
          scope = scope.$parent;
      }
    });
  }]);

  function pcKeyboard() {
    return {
      POWER:       190,  // <.> Power
      NUM_0:       48,
      NUM_1:       49,
      NUM_2:       50,
      NUM_3:       51,
      NUM_4:       52,
      NUM_5:       53,
      NUM_6:       54,
      NUM_7:       55,
      NUM_8:       56,
      NUM_9:       57,
      LAST:        90,  // <Z> Last
      VOLUME_DOWN: 189, // -_
      VOLUME_UP:   187, // +=
      CHANNEL_DOWN:34,  // PageDown
      CHANNEL_UP:  33,  // PageUp
      INFO:        73,  // [I]nfo
      MUTE:        85,  // m[U]te
      MENU:        77,  // [M]enu
      FAVORITE:    70,  // [F]avorite
      LIST:        76,  // [L]ist
      SETTINGS:    83,  // [S]ettings
      BACK:        8,   // Backspace
      EXIT:        420,  // Escape
      LEFT:        37,
      UP:          38,
      RIGHT:       39,
      DOWN:        40,
      SELECT:      13,
      YELLOW:      65, // <A>
      BLUE:        66, // <B>
      RED:         67, // <С>
      GREEN:       68, // <D>
      PLAY:        81, // <Q> Play
      STOP:        87, // <W> Stop
      PAUSE:       69, // <E> Pause
      RECORD:      82, // [R]ecord
      REWIND:      84, // <T> Rewind
      FORWARD:     89, // <Y> Forward
      GUIDE:       71  // [G]uide
    };
  }

  function smarttvKeyboard() {
    var tvKey = new Common.API.TVKeyValue();
    return {
      POWER:       tvKey.KEY_POWER,
      NUM_0:       tvKey.KEY_0,
      NUM_1:       tvKey.KEY_1,
      NUM_2:       tvKey.KEY_2,
      NUM_3:       tvKey.KEY_3,
      NUM_4:       tvKey.KEY_4,
      NUM_5:       tvKey.KEY_5,
      NUM_6:       tvKey.KEY_6,
      NUM_7:       tvKey.KEY_7,
      NUM_8:       tvKey.KEY_8,
      NUM_9:       tvKey.KEY_9,
      LAST:        tvKey.KEY_PRECH,
      VOLUME_DOWN: tvKey.KEY_VOL_DOWN,
      VOLUME_UP:   tvKey.KEY_VOL_UP,
      CHANEL_DOWN: tvKey.KEY_CH_DOWN,
      CHANEL_UP:   tvKey.KEY_CH_UP,
      INFO:        tvKey.KEY_INFO,
      MUTE:        tvKey.KEY_MUTE,
      MENU:        tvKey.KEY_MENU,
      FAVORITE:    tvKey.KEY_FAVCH,
      LIST:        tvKey.KEY_CHLIST,
      SETTINGS:    tvKey.KEY_TOOLS,
      BACK:        tvKey.KEY_RETURN,
      EXIT:        tvKey.KEY_EXIT,
      LEFT:        tvKey.KEY_LEFT,
      UP:          tvKey.KEY_UP,
      RIGHT:       tvKey.KEY_RIGHT,
      DOWN:        tvKey.KEY_DOWN,
      SELECT:      tvKey.KEY_ENTER,
      YELLOW:      tvKey.KEY_YELLOW,
      BLUE:        tvKey.KEY_BLUE,
      RED:         tvKey.KEY_RED,
      GREEN:       tvKey.KEY_GREEN,
      PLAY:        tvKey.KEY_PLAY,
      STOP:        tvKey.KEY_STOP,
      PAUSE:       tvKey.KEY_PAUSE,
      RECORD:      tvKey.KEY_REC,
      REWIND:      tvKey.KEY_RW,
      FORWARD:     tvKey.KEY_FF,
      GUIDE:       tvKey.KEY_GUIDE,

      SOURCE: tvKey.KEY_SOURCE,

      FP_POWER:        tvKey.KEY_PANEL_POWER,
      FP_CHANNEL_UP:   tvKey.KEY_PANEL_CH_UP,
      FP_CHANNEL_DOWN: tvKey.KEY_PANEL_CH_DOWN,
      FP_VOLUME_UP:    tvKey.KEY_PANEL_VOL_UP,
      FP_VOLUME_DOWN:  tvKey.KEY_PANEL_VOL_DOWN,
      FP_SELECT:       tvKey.KEY_PANEL_ENTER
    };
  }

})(window.Common);
