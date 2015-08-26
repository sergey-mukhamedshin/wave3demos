angular.module('logging', [])
	.service('console', [function () {

		var LOG_LEVELS = ['debug', 'info', 'warn', 'error', 'off'],
			PREFIXES = ['debug', 'warn', 'error'],
			DEFAULT_LOG_LEVEL = 'debug',
			levelMap = {
				off: [],
				error: ['error', 'assert'],
				warn: ['error', 'assert', 'warn'],
				info: ['error', 'assert', 'warn', 'info', 'log', 'count', 'time', 'timeEnd'],
				debug: ['error', 'assert', 'warn', 'info', 'log', 'count', 'time', 'timeEnd', 'debug', 'dir', 'dom', 'stack'],
				all: ['error', 'assert', 'warn', 'info', 'log', 'count', 'time', 'timeEnd', 'debug', 'dir', 'dom', 'stack']
			};

		var consoleName = '';
		var labels = {};
		var logLevel;

		function format(/*, params */) {
			if (arguments || arguments.length > 0) {

				var args;
				if (arguments[0] instanceof Array)
					args = arguments[0];
				else
					args = arguments;

				for (var i = 1; i < args.length; ++i)
					args[0] = args[0].replace('%' + i, args[i]);
				return args[0];
			}
		}

		function timestamp() {
			var now = new Date();
			return z2(now.getHours()) +
				':' + z2(now.getMinutes()) +
				':' + z2(now.getSeconds()) +
				'.' + z3(now.getMilliseconds()) + ' ';

			function z2(num) {
				return (num < 10 ? '0' : '') + num;
			}

			function z3(num) {
				return (num < 10 ? '00' : num < 100 ? '0' : '') + num;
			}
		}

		function print(method, args) {
			args = Array.prototype.slice.call(args);

			if (args[0].toLowerCase && args[0].toLowerCase() === 'fatal')
				args[0] = timestamp() + args[0];
			else if (PREFIXES.indexOf(method) !== -1)
				args[0] = timestamp() + consoleName + method.toUpperCase() + ' ' + args[0];
			else
				args[0] = timestamp() + consoleName + args[0];

			platform.print(method, format(args));
		}

		function getLabel(label) {
			if (!(label in labels))
				labels[label] = { count: 0 };

			return labels[label];
		}

		var consoleFunction = {
			debug: function (/* object [, object, ...] */) {
				print('debug', arguments);
			},

			log: function (/* object [, object, ...] */) {
				print('info', arguments);
			},

			info: function (/* object [, object, ...] */) {
				print('info', arguments);
			},

			count: function (label) {
				this.info(label + ':', ++getLabel(label).count);
			},

			time: function (label) {
				getLabel(label).startTime = new Date().getTime();
			},

			timeEnd: function (label) {
				if (label in labels && labels[label].startTime) {
					this.info(label + ':', formatTime(new Date().getTime() - labels[label].startTime));
					delete labels[label].startTime;
				}

				function formatTime(interval) {
					return (interval < 1000 ? interval : parseInt(interval / 1000) + "." + interval % 1000) + 'ms';
				}
			},

			warn: function (/* object [, object, ...] */) {
				print('warn', arguments);
			},

			error: function (/* object [, object, ...] */) {
				print('error', arguments);
			},

			assert: function (expression, message) {
				if (!expression)
					this.error('ASSERT', message); // Out format: 20:20:22.244 [APP] ERROR ASSERT message
			},

			dom: function (element, message /*, params */) {
				var args = [this.domstr(element) + ' ' + message ];

				for (var i = 2; i < arguments.length; ++i)
					args.push(arguments[i]);

				this.debug(format(args));
			},

			stack: function (depth) {
				this.debug(this.stackstr(depth));
			},

			dir: function (object) {
				this.debug(this.dirstr(object));
			}
		};

		window.onerror = function (msg, fileName, lineNo) {
			print('error', ['FATAL %1 %2 %3', msg, fileName, lineNo]);
		};

		function Console() {
			this.setLogLevel(DEFAULT_LOG_LEVEL);
		}

		Console.prototype = {
			getLogLevel: function () {
				return logLevel;
			},

			setLogLevel: function (level) {
				if (LOG_LEVELS.indexOf(level) === -1)
					level = DEFAULT_LOG_LEVEL;

				logLevel = level;

				for (var i = 0; i < levelMap.all.length; i++)
					this[levelMap.all[i]] = function () { };

				for (var j = 0; j < levelMap[level].length; j++)
					this[levelMap[level][j]] = consoleFunction[levelMap[level][j]].bind(this);
			},

			setName: function (name) {
				consoleName = name ? '[' + name + '] ' : '';
			},

			stackstr: function(depth){
				try {
					throw Error();
				} catch (e) {
					var info = ' not supported';
					if (e.stack) {
						var stack = e.stack.split('\n').slice(3, depth ? 3 + depth : e.stack.length);
						info = '\n' + stack.join('\n');
					}

					return "Call stack: " + info;
				}			
			},

			dirstr: function (object) {
				var dirObjects = {};
				return dirHelper(object, 'root', 1);

				function dirObjectStored(o) {
					var prop, found = false;
					for (prop in dirObjects)
						if (Object.prototype.hasOwnProperty.call(dirObjects, prop))
							if (dirObjects[prop] === o) {
								found = true;
								break;
							}
					return found ? prop : false;
				}

				function getIndent(level) {
					return Array(level).join('\t');
				}

				function dirHelper(o, k, level) {
					if (typeof o === 'function')
						return 'function';

					if (typeof o !== 'object')
						return o;
					
					if (dirObjectStored(o))
						return '&' + dirObjectStored(o);

					var result = '';
					dirObjects[k] = o;

					if (o instanceof Array) {
						result = '[';
						for (var i in o) {
							result += '\n' + getIndent(level + 1) + i + ': ' + dirHelper(o[i], k + '[' + i + ']', level + 1);
						}
						result += '\n' + getIndent(level);
						result += ']';
					}
					else {
						result = '{';
						for (var i in o) {
							result += '\n' + getIndent(level + 1) + i + ': ' + dirHelper(o[i], k + '.' + i, level + 1);
						}
						result += '\n' + getIndent(level);
						result += '}';
					}
					return result;
				}
			},

			domstr: function(element) {
				var e = angular.element(element);

				if (e[0].id)
					return format('[#%2]', e[0].tagName, e[0].id);

				var className = e.attr('class');
				if (className)
					return format('[%1.%2]', e[0].tagName, className);

				return format('[%1]', e.text().replace(/[\s]+/g, ''));
			}
		};

		return new Console();
	}]);
