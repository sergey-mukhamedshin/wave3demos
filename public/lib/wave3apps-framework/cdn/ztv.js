ztv = {version: '0.0.1'};

(function() {

  if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
      var aArgs = Array.prototype.slice.call(arguments, 1),
          fToBind = this,
          fNOP = function () {},
          fBound = function () {
            return fToBind.apply(this instanceof fNOP? this : oThis,
              aArgs.concat(Array.prototype.slice.call(arguments)));
          };
      fNOP.prototype = this.prototype;
      fBound.prototype = new fNOP();
      return fBound;
    };
  }

})();

(function() {

  ztv.Object = {};

  var toString = Object.prototype.toString;

  var getType =
  ztv.Object.getType = function(obj) {
    return obj === null? "Null" : toString.call(obj).slice(8, -1);
  };

  ztv.Object.objInfo = function(obj) {
    var objType = getType(obj);
    if (objType.substr(0, 4) === 'HTML') {
      var tag = obj.tagName.toLowerCase(),
          id = obj.id,
          classes = obj.className.split(/ +/).filter(function(item) { return !!item; });
      return tag + (id? '#' + id : '') + (classes.length? '.' + classes.join('.') : '');
    }
    else if (objType === 'String' || objType === 'Number')
      return obj;
    else
      return '[object ' + objType + ']';
  };

})();

(function() {
	ztv.q = {};

	ztv.q.defer = function() {
		return new Deferred();
	};

	ztv.q.all = function(promises) {
		var deferred = new Deferred();
		var toResolve = promises.length;

		function resolve() {
			if (--toResolve <= 0)
				deferred.resolve();
		}
		function reject(message) {
			deferred.reject(message);
		}

		for (var i = 0; i < toResolve; ++i)
			promises[i].then(resolve, reject);

		return deferred.promise;
	};

	/* private */

	function Deferred() {
		this.promise = new Promise();
	}

	Deferred.prototype.resolve = function(message) {
		this.promise._resolve(message);
	};

	Deferred.prototype.reject = function(message) {
		this.promise._reject(message);
	};

	var STATUSES = {
		RESOLVED: 'resolved',
		REJECTED: 'rejected'
	};

	function Promise() {
		this._resolveQueue = [];
		this._rejectQueue = [];
	}

	Promise.prototype.then = function(onFulfilled, onRejected) {
		if (onFulfilled instanceof Function)
			this._resolveQueue.push(onFulfilled);
		if (onRejected instanceof Function)
			this._rejectQueue.push(onRejected);

		if (this.status == STATUSES.REJECTED)
			this._reject(this._message);
		else if (this.status == STATUSES.RESOLVED)
			this._resolve(this._message);
	};

	Promise.prototype._resolve = function(message) {
		this.status = STATUSES.RESOLVED;

		if (message)
			this._message = message;
		else
			message = this._message;

		var callback = this._resolveQueue.shift();
		while (callback) {
			callback(message);
			callback = this._resolveQueue.shift();
		}
	};

	Promise.prototype._reject = function(message) {
		this.status = STATUSES.REJECTED;

		if (message)
			this._message = message;
		else
			message = this._message;

		var callback = this._rejectQueue.shift();
		while (callback) {
			callback(message);
			callback = this._rejectQueue.shift();
		}
	};
})();

(function() {
  'use strict';

  ztv.loadScript = function(url, done, fail) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = path;
    if (done instanceof Function) {
      script.onload = function () {
        if (!this.readyState || this.readyState === 'complete')
          done();
      };
      script.onreadystatechange = script.onload;
    }
    if (fail instanceof Function)
      script.onerror = fail;
    document.body.appendChild(script);
  };

  ztv.qLoadScript = function(url) {
    var deferred = ztv.q.defer();
    ztv.loadScript(url, function() {
      deferred.resolve();
    }, function(evt) {
      deferred.reject(evt);
    });
    xhr.send();
    return deferred.promise;
  };

})();

(function() { 'use strict';

  ztv.platform = {};

  ztv.platform.collection = {
    SmartTV:  { name: "SmartTV" },
    Broadcom: { name: "Broadcom" },
    PC:       { name: "PC" }
  };

  ztv.platform.current = defineCurrentPlatform();

  function defineCurrentPlatform() {
    var ua = window.navigator.userAgent;
    if (/smart-tv/i.test(ua))
      return ztv.platform.collection.SmartTV;
    else if (/broadcom/i.test(ua))
      return ztv.platform.collection.Broadcom;
    else
      return ztv.platform.collection.PC;
  }

  ztv.platform.collection.SmartTV.init = function() {
    var deferred = ztv.q.defer();
    ztv.q.all([
      ztv.qLoadScript('$MANAGER_WIDGET/Common/API/Widget.js'),
      ztv.qLoadScript('$MANAGER_WIDGET/Common/API/Plugin.js'),
      ztv.qLoadScript('$MANAGER_WIDGET/Common/API/TVKeyValue.js'),
      ztv.qLoadScript('$MANAGER_WIDGET/Common/Util/Include.js'),
      ztv.qLoadScript('$MANAGER_WIDGET/Common/Util/Language.js'),
      ztv.qLoadScript('$MANAGER_WIDGET/Common/Plugin/Define.js'),
      ztv.qLoadScript('$MANAGER_WIDGET/Common/IME/ime2.js')
    ]).then(function() {
      deferred.resolve();
    }, function(error) {
      throw error;
    });
    return deferred.promise;
  };

})();

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

(function() {
	var LOCALES_PATH = 'locales';

	/* PUBLIC */

	ztv.i18n = {};

	ztv.i18n.get = function(constant, options) {
		return get(constant, options);
	};

	ztv.i18n.getMessage = function(constant, options) {
		return get(constant, options).message;
	};

	ztv.i18n.loadLocale = function(locale) {
		messages = [];

		var promises = [];
		for (var i = 0; i < resources.length; ++i)
			promises.push(loadResource([LOCALES_PATH, locale, resources[i]].join('/')));

		return ztv.q.all(promises);
	};

	ztv.i18n.useResources = function(paths) {
		resources = typeof paths == 'string' ? [paths] : paths;
	};

	/* PRIVATE */

	var messages = [];
	var resources = [];

	function loadResource(path) {
		var deferred = ztv.q.defer();

		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					xhr.onreadystatechange = null;

					var data = JSON.parse(xhr.responseText);

					if (data && data.messages)
						messages = messages.concat(data.messages);
				}
				else
					ztv.console.error('Cannot load ' + path);

				deferred.resolve();
			}
		};
		xhr.open('GET', path, false);
		xhr.send(null);

		return deferred.promise;
	}

	function get(constant, options) {
		for (var i = 0; i < messages.length; ++i)
			if (messages[i].const == constant)
				return {
					id: messages[i].id,
					const: constant,
					message: parseString(messages[i].message, options),
					description: parseString(messages[i].description, options)
				};

		ztv.console.warn('Message for %s not found', constant);
		return {
			id: '',
			const: constant,
			message: constant,
			description: ''
		};
	}

	function parseString(str, options) {
		return options ? str.replace(/\{\{\s*(.+?)\s*\}\}/gm, function(template, variable) {
			var path = variable.split('.');
			var value = options;

			for (var i = 0; i < path.length; ++i)
				if (typeof value == 'undefined')
					break;
				else
					value = value[path[i]];

			return value;
		}) : str;
	}
})();

(function() { 'use strict';

	var nameSpaces = {};
	var separator = ':';
	var supported = [
		{
			get: get_localStorage,
			set: set_localStorage,
			remove: remove_localStorage
		},
		{
			get: get_config,
			set: unsupported,
			remove: unsupported
		}
	];
	var config = {};

	var NS = function(name) {
		this.name = name;
	};

	NS.prototype.get = function(key) {
		var deferred = ztv.q.defer();

		get({
			namespace: this.name,
			key: key,
			deferred: deferred
		});

		return deferred.promise;
	};

	NS.prototype.set = function(key, value) {
		var deferred = ztv.q.defer();

		set({
			namespace: this.name,
			key: key,
			value: value,
			deferred: deferred
		});

		return deferred.promise;
	};

	NS.prototype.remove = function(key) {
		var deferred = ztv.q.defer();

		remove({
			namespace: this.name,
			key: key,
			deferred: deferred
		});

		return deferred.promise;
	};

	function get(params) {
		var deferred = params.deferred;
		var i;
		var all = {};

		function tryOne(value) {
			if (value === null || typeof value == 'undefined') {
				if (++i >= supported.length)
					deferred.reject();
				else
					supported[i].get(params).then(tryOne, tryOne);
			}
			else
				deferred.resolve(value);
		}

		function tryAll(data) {
			for (var key in data)
				if (data.hasOwnProperty(key))
					all[key] = data[key];
			if (--i < 0)
				deferred.resolve(all);
			else
				supported[i].get(params).then(tryAll, tryAll);
		}


		if (typeof params.key != 'undefined') {
			i = 0;
			supported[i].get(params).then(tryOne, tryOne);
		}
		else {
			i = supported.length - 1;
			supported[i].get(params).then(tryAll, tryAll);
		}
	}
	function set(params) {
		var success = false;
		for (var i = 0; i < supported.length; ++i)
			if (supported[i].set(params))
				success = true;
		if (!success)
			params.deferred.reject();
	}
	function remove(params) {
		for (var i = 0; i < supported.length; ++i)
			supported[i].remove(params);

		params.deferred.resolve();
	}
	function unsupported() { return false; }

	/* localStorage */

	function get_localStorage(params) {
		var deferred = ztv.q.defer();

		setTimeout(function() {
			if (typeof params.key != 'undefined')
				deferred.resolve(JSON.parse(localStorage.getItem(params.namespace + separator + params.key)));
			else
				deferred.resolve(getKeysFromLocalStorage(params.namespace).reduce(function(result, key) {
					result[key] = JSON.parse(localStorage.getItem(params.namespace + separator + key));
					return result;
				}, {}));
		}, 0);

		return deferred.promise;
	}
	function set_localStorage(params) {
		setTimeout(function() {
			if (typeof params.value != 'undefined')
				localStorage.setItem(params.namespace + separator + params.key, JSON.stringify(params.value));

			params.deferred.resolve(true);
		}, 0);

		return true;
	}
	function remove_localStorage(params) {
		localStorage.removeItem(params.namespace + separator + params.key);
	}

	function getKeysFromLocalStorage(namespace) {
		var keys = [];
		for (var i = 0; i < localStorage.length; ++i) {
			var key = localStorage.key(i);
			if (key.indexOf(namespace + separator) === 0)
				keys.push(key.replace(namespace + separator, ''));
		}

		return keys;
	}

	/* config */

	function get_config(params) {
		var deferred = ztv.q.defer();

		setTimeout(function() {
			if (typeof params.key != 'undefined')
				deferred.resolve(config[params.key]);
			else {
				var all = {};
				for (var key in config)
					if (config.hasOwnProperty(key))
						all[key] = config[key];
				deferred.resolve(all);
			}
		}, 0);


		return deferred.promise;
	}

	ztv.settings = {};

	ztv.settings.init = function() {
		var deferred = ztv.q.defer();

		var _ = new XMLHttpRequest();
		_.open('GET', 'config.json', true);
		_.onreadystatechange = function() {
			if (this.readyState == 4) {
				if (this.status == 200) {
					config = JSON.parse(this.responseText);
					deferred.resolve();
				}
				else
					deferred.reject('[HTTP error]: ' + this.status);
			}
		};
		_.send();

		return deferred.promise;
  };

  ztv.settings.getNamespace = function(name) {
		if (!(name in nameSpaces)) {
			nameSpaces[name] = new NS(name);
		}

		return nameSpaces[name];
  };

	ztv.settings.clearNamespace = function(name) {
		var deferred = ztv.q.defer();
		var ns = this.getNamespace(name);
		ns.get().then(function(settings) {
			var promises = [];

			for (var key in settings)
				if (settings.hasOwnProperty(key))
					promises.push(ns.remove(key));

			ztv.q.all(promises).then(deferred.resolve.bind(deferred), deferred.reject.bind(deferred));
		});

		return deferred.promise;
  };

})();

(function() { 'use strict';

	var readyQueue = [];

	ztv.onReady = function(callback) {
		readyQueue.push(callback);
	};

  ztv.runApplication = function(appName, done) {
    ztv.onReady(function() {
      done();
      angular.bootstrap(document, [appName]);
    });
  };

  var platformInit = ztv.platform.current.init || function() {
    var deferred = ztv.q.defer();
    setTimeout(deferred.resolve.bind(deferred), 0);
    return deferred.promise;
  };

	ztv.q.all([
		ztv.settings.init(),
    platformInit()
	]).then(function() {
		var callback = readyQueue.shift();
		while (callback) {
			if (callback instanceof Function)
				callback();
			callback = readyQueue.shift();
		}
	}, function(error) {
		throw error;
	});

})();
