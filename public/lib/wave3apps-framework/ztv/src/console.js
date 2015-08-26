(function() { 'use strict';

  var LOG_LEVELS = ['debug', 'info', 'warn', 'error', 'off'],
      PREFIXES = ['debug', 'warn', 'error'],
      DEFAULT_LOG_LEVEL = 'debug',
      levelMap = {
        off:    [],
        error:  ['error', 'assert'],
        warn:   ['error', 'assert', 'warn'],
        info:   ['error', 'assert', 'warn', 'info', 'log', 'count', 'time', 'timeEnd' ],
        debug:  ['error', 'assert', 'warn', 'info', 'log', 'count', 'time', 'timeEnd', 'debug', 'dir'],
        all:    ['error', 'assert', 'warn', 'info', 'log', 'count', 'time', 'timeEnd', 'debug', 'dir']
      };

  var platformPrint = {
    SmartTV: function(method, message) {
      alert(message);
    },
    PC: function(method, message) {
      window.console[method](message);
    },
    Broadcom: function(method, message) {
      window.console[method](message);
    }
  };

  var UnifiedConsole = function(name) {
		this._name = name ? '[' + name + '] ': '';
		this._labels = {};
		this.setLogLevel(DEFAULT_LOG_LEVEL);
		this._checkAngular(name);
    this._printPlatform = platformPrint[ztv.platform.current.name];
  };

	UnifiedConsole.prototype.getConsole = function(name) {
		var consoleInstance = new UnifiedConsole(name);
    consoleInstance.setLogLevel(this.getLogLevel());
		return consoleInstance;
	};

	UnifiedConsole.prototype.getLogLevel = function() {
		return this._level;
	};

  UnifiedConsole.prototype.setLogLevel = function(level) {
    if (LOG_LEVELS.indexOf(level) === -1)
      level = DEFAULT_LOG_LEVEL;

    this._level = level;

    var i;

    for (i = 0; i < levelMap.all.length; i++)
      this[levelMap.all[i]] = nop;

    for (i = 0; i < levelMap[level].length; i++)
      this[levelMap[level][i]] = consoleFunction[levelMap[level][i]].bind(this);

  };

  var _MAX_ANGULAR_TRY_COUNT = 100,
      oldConsole = window.console,
      slice = Array.prototype.slice,
      hasOwnProperty = Object.prototype.hasOwnProperty,
      nop = function() {};

  var consoleFunction = {};

  consoleFunction.debug = function() {
    this._print('debug', arguments);
  };

  consoleFunction.dir = function(object) {
    this._dirObjects = {
      ROOT_OBJECT: object
    };
    this._dirHelper(object, '');
  };

  consoleFunction.log = function() {
    this._print('info', arguments);
  };

  consoleFunction.info = consoleFunction.log;

  consoleFunction.count = function(label) {
    this.info(label + ':', ++this._getLabel(label).count);
  };

  consoleFunction.time = function(label) {
    this._getLabel(label).startTime = new Date().getTime();
  };

  consoleFunction.timeEnd = function(label) {
    if (label in this._labels && this._labels[label].startTime) {
      this.info(label + ':', formatTime(new Date().getTime() - this._labels[label].startTime));
      delete this._labels[label].startTime;
    }
  };

  consoleFunction.warn = function() {
    this._print('warn', arguments);
  };

  consoleFunction.error = function() {
    this._print('error', arguments);
  };

  consoleFunction.assert = function(expression, message) {
    if (!expression)
      // Out format: 20:20:22.244 [APP] ERROR ASSERT message
      this.error('ASSERT', message);
  };

  function formatTime(interval) {
    return (interval < 1000? interval : parseInt(interval/1000) + "." + interval%1000) + 'ms';
  }

  UnifiedConsole.prototype._print = function(method, args) {
		args = slice.call(args);

		if (args[0].toLowerCase && args[0].toLowerCase() === 'fatal')
			args[0] = timestamp() + args[0];
		else if (PREFIXES.indexOf(method) !== -1)
			args[0] = timestamp() + this._name + method.toUpperCase() + ' ' + args[0];
		else
			args[0] = timestamp() + this._name + args[0];

		this._printPlatform(method, printf(args));
	};

	//noinspection FunctionWithInconsistentReturnsJS
  UnifiedConsole.prototype._dirHelper = function(o, indent) {
		if (oldConsole.dir)
			return oldConsole.dir(o);

		try {
			for (var i in o)
				if (o.hasOwnProperty(i))	{
					if (o[i] instanceof Array)
						this.debug('%s%s = [%s]', indent, i, o[i]);
					else if (typeof o[i] === 'object') {
						var stored = this._dirObjectStored(o[i]);
						if (stored !== false)
							this.debug('%s%s = RECURSIVE_LINK to %s', indent, i, stored);
						else {
							this.debug('%s%s = {', indent, i);
							this._dirObjects[i] = o[i];
							this._dirHelper(o[i], indent + '  ');
							this.debug('%s}', indent);
						}
					}
					else
						this.debug('%s%s = %s', indent, i, typeof o[i] === 'function' ? 'function' : o[i]);
				}
		}
		catch(e) {
			this.error(e.message);
		}
	};

	UnifiedConsole.prototype._dirObjectStored = function (o) {
    var prop, found = false;
		for (prop in this._dirObjects)
      if (hasOwnProperty.call(this._dirObjects, prop))
        if (this._dirObjects[prop] === o) {
          found = true;
          break;
        }

		return found? prop : false;
	};

	UnifiedConsole.prototype._getLabel = function(label) {
		if (!(label in this._labels))
			this._labels[label] = {count: 0};

		return this._labels[label];
	};

	UnifiedConsole.prototype._checkAngular = function(name) {
		if (name) {
			try {
				angular.module(name).factory('$exceptionHandler', function() {
					return function(exception) {
						ztv.console._print('error', ['FATAL', exception.stack || exception.message]);
					};
				});
			}
			catch(e) {
				this._tryAngularCount = (this._tryAngularCount || 0) + 1;

				if (this._tryAngularCount < _MAX_ANGULAR_TRY_COUNT)
					setTimeout(this._checkAngular.bind(this, name), 0);
			}
		}
	};

	function printf(args) {
    if (ztv.Object.getType(args[0]) === 'String')
      return [args.shift().replace(/(%s|%d|%i|%f|%o|%O|%c)/g, function() {
        return (ztv.Object.objInfo || String)(args.shift());
      })].concat(args).join(' ');
    else
      return args.map(function() {
        return (ztv.Object.objInfo || String)(args.shift());
      }).join(' ');
	}

	function timestamp() {
		var now = new Date();
		return z2(now.getHours())	+
			':' + z2(now.getMinutes()) +
			':' + z2(now.getSeconds()) +
			'.' + z3(now.getMilliseconds()) + ' ';
	}

	function z2(num) {
		return (num < 10 ? '0' : '') + num;
	}

  function z3(num) {
    return (num < 10 ? '00' : num < 100 ? '0' : '') + num;
  }

	ztv.console = new UnifiedConsole();

	window.onerror = function(msg, fileName, lineNo) {
		ztv.console._print('error', ['FATAL', msg, fileName, lineNo]);
	};
})();
