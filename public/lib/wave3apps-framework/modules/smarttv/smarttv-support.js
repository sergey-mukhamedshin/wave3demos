(function() {
	'use strict';

	if (/SMART-TV/.test(window.navigator.userAgent)) {
		window.console = {
			log: function() {
				window.alert(arguments.length > 1 ? Array.prototype.slice.call(arguments).join(', ') : arguments[0]);
			}
		};

		var smarttvScripts = [
			'$MANAGER_WIDGET/Common/API/Widget.js',
			'$MANAGER_WIDGET/Common/API/TVKeyValue.js'
		];
		/* jshint ignore:start */
		for (var i = 0; i < smarttvScripts.length; ++i)
			document.write('<script src="' + smarttvScripts[i] + '"></script>');
		/* jshint ignore:end */

		window.addEventListener('load', function() {
			new Common.API.Widget().sendReadyEvent();
		}, false);
	}
})();