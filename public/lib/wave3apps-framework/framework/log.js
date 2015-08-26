'use strict';

angular.module('log', []).factory('log', [function () {

	function log(message /*, params */) {
		for (var i = 1; i < arguments.length; ++i)
			message = message.replace('%' + i, arguments[i]);

		platform.log(new Date().toUTCString() + ': ' + message);
	}

	log.getElementId = function (element) {
		var e = angular.element(element);

		if (e[0].id)
			return e[0].id;

		var className = e.attr('class');
		if (className)
			return e[0].tagName + '.' + className;

		return e.text().replace(/[\s]+/g, '');
	};

	log.dom = function (element, message /*, params */) {
		var args = ['[' + this.getElementId(element) + '] ' + message];

		for (var i = 2; i < arguments.length; ++i)
			args.push(arguments[i]);

		this.apply(this, args);
	};

	log.stack = function (depth) {
		try {
			throw Error();
		} catch (e) {
			var info = ' not supported';
			if (e.stack) {
				var stack = e.stack.split('\n').slice(3, depth ? 3 + depth : e.stack.length);
				info = '\n' + stack.join('\n');
			}

			this('Call stack:%1', info);
		}
	};

	return log;
}]);