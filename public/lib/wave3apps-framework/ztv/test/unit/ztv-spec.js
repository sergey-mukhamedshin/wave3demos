/*
	ztv.js
*/
describe("ztv", function() {

	describe(".platform", function() {
		it('should be default', function() {
			expect(ztv.platform.current).toBeTruthy();
		});
	});

  describe(".Object", function() {
    it('.getType should define different types.', function() {
      var getType = ztv.Object.getType;
      expect(getType).toBeDefined();
      expect(getType( null   )).toBe("Null");
      expect(getType( window )).toBe("DOMWindow");
      expect(getType( []     )).toBe("Array");
      expect(getType( '1'    )).toBe("String");
      expect(getType( {}     )).toBe("Object");
      expect(getType(document)).toBe("HTMLDocument");
      expect(getType(document.body)).toBe("HTMLBodyElement");
      expect(getType(document.createElement('div'))).toBe("HTMLDivElement");
      expect(getType(document.getElementById)).toBe("Function");
    });

    it('.getInfo should simple describe HTML elements', function() {
      var objInfo = ztv.Object.objInfo;

      var div = document.createElement('div');
      div.className = " class1  class2 ";
      div.id = "test";
      expect(objInfo(div)).toBe('div#test.class1.class2');
    });

  });

	describe(".console", function() {
		var log;

		ztv.console._printPlatform = function(method, args) {
			if (args instanceof Array)
				log += Array.prototype.slice.call(args).join(' ');
			else
				log += args;
		};

		beforeEach(function() {
			log = '';
			ztv.console.setLogLevel('debug');
		});

		it('.setLogLevel and .getLogLevel', function() {
			var defaultLevel = ztv.console.getLogLevel();
			var levels = ['debug', 'info', 'warn', 'error', 'off'];

			for (var i = 0; i < levels.length; ++i) {
				ztv.console.setLogLevel(levels[i]);
				expect(ztv.console.getLogLevel()).toBe(levels[i]);
			}

			ztv.console.setLogLevel('any');
			expect(ztv.console.getLogLevel()).toBe(defaultLevel);
		});

		it('.assert', function() {
			var message = 'any message';

			ztv.console.assert(true, message);
			expect(log).toBe('');

			ztv.console.assert(false, message);
			expect(log).toContain(message);
		});

		it('.count', function() {
			var label = 'any label';

			ztv.console.count(label);
			expect(log).toContain(label + ': 1');

			ztv.console.count(label);
			expect(log).toContain(label + ': 2');

			ztv.console.count(label);
			ztv.console.count(label);
			ztv.console.count(label);
			expect(log).toContain(label + ': 5');
		});

		it('.debug', function() {
			var message = 'any message';
			var format = /\d{2}:\d{2}:\d{2}\.\d+ DEBUG .+/;

			ztv.console.debug(message);
			expect(log).toContain(message);
			expect(log).toContain('DEBUG');
			expect(format.test(log)).toBeTruthy();
		});

		it('.dir', function() {
			var object = {foo: {bar: 1}};
			var format = /\d{2}:\d{2}:\d{2}\.\d+ DEBUG foo = {\d{2}:\d{2}:\d{2}\.\d+ DEBUG   bar = 1\d{2}:\d{2}:\d{2}\.\d+ DEBUG }/;

			window.console.dir = function(object) {log = object};
			ztv.console.dir(object);
			expect(log).toBe(object);

			log = '';
			window.console.dir = null;
			ztv.platform.default = false;
			ztv.platform.broadcom = true;

			ztv.console.dir(object);
			expect(format.test(log)).toBeTruthy();

			ztv.platform.default = true;
			ztv.platform.broadcom = false;
		});

		it('.error', function() {
			var message = 'any message';
			var format = /\d{2}:\d{2}:\d{2}\.\d+ ERROR .+/;

			ztv.console.error(message);
			expect(log).toContain(message);
			expect(log).toContain('ERROR');
			expect(format.test(log)).toBeTruthy();
		});

		it('.info and .log', function() {
			var message = 'any message';
			var format = /\d{2}:\d{2}:\d{2}\.\d+ .+/;

			ztv.console.info(message);
			expect(log).toContain(message);
			expect(format.test(log)).toBeTruthy();

			ztv.console.log(message);
			expect(log).toContain(message);
			expect(format.test(log)).toBeTruthy();
		});

		it('.time and timeEnd', function() {
			var label = 'any label';
			var format = /\d{2}:\d{2}:\d{2}\.\d+ any label: \d+ms/;

			ztv.console.time(label);
			ztv.console.timeEnd(label);
			expect(log).toContain(label);
			expect(format.test(log)).toBeTruthy();
		});

		it('.warn', function() {
			var message = 'any message';
			var format = /\d{2}:\d{2}:\d{2}\.\d+ WARN .+/;

			ztv.console.warn(message);
			expect(log).toContain(message);
			expect(log).toContain('WARN');
			expect(format.test(log)).toBeTruthy();
		});

    it('should write to useful format of HTML elements', function() {
      var div = document.createElement('div');
      div.className = " class1  class2 ";
      div.id = "test";
      ztv.console.log("%s", div);
      expect(log).toContain('div#test.class1.class2');
    });

    describe(".getConsole", function() {
			var name = 'NAME';
			var _console = ztv.console.getConsole(name);

			_console._printPlatform = function(method, args) {
				if (args instanceof Array)
					log += Array.prototype.slice.call(args).join(' ');
				else
					log += args;
			};

			beforeEach(function() {
				log = '';
				_console.setLogLevel('debug');
			});

			it('.setLogLevel and .getLogLevel', function() {
				var defaultLevel = _console.getLogLevel();
				var levels = ['debug', 'info', 'warn', 'error', 'off'];

				for (var i = 0; i < levels.length; ++i) {
					_console.setLogLevel(levels[i]);
					expect(_console.getLogLevel()).toBe(levels[i]);
				}

				_console.setLogLevel('any');
				expect(_console.getLogLevel()).toBe(defaultLevel);
			});

			it('.assert', function() {
				var message = 'any message';

				_console.assert(true, message);
				expect(log).toBe('');

				_console.assert(false, message);
				expect(log).toContain(message);
			});

			it('.count', function() {
				var label = 'any label';

				_console.count(label);
				expect(log).toContain(label + ': 1');

				_console.count(label);
				expect(log).toContain(label + ': 2');

				_console.count(label);
				_console.count(label);
				_console.count(label);
				expect(log).toContain(label + ': 5');
			});

			it('.debug', function() {
				var message = 'any message';
				var format = /\d{2}:\d{2}:\d{2}\.\d+ \[NAME\] DEBUG .+/;

				_console.debug(message);
				expect(log).toContain(name);
				expect(log).toContain(message);
				expect(log).toContain('DEBUG');
				expect(format.test(log)).toBeTruthy();
			});

			it('.dir', function() {
				var object = {foo: {bar: 1}};
				var format = /\d{2}:\d{2}:\d{2}\.\d+ \[NAME\] DEBUG foo = {\d{2}:\d{2}:\d{2}\.\d+ \[NAME\] DEBUG   bar = 1\d{2}:\d{2}:\d{2}\.\d+ \[NAME\] DEBUG }/;

				window.console.dir = function(object) {log = object};
				_console.dir(object);
				expect(log).toBe(object);

				log = '';
				window.console.dir = null;
				ztv.platform.default = false;
				ztv.platform.broadcom = true;

				_console.dir(object);
				expect(format.test(log)).toBeTruthy();

				ztv.platform.default = true;
				ztv.platform.broadcom = false;
			});

			it('.error', function() {
				var message = 'any message';
				var format = /\d{2}:\d{2}:\d{2}\.\d+ \[NAME\] ERROR .+/;

				_console.error(message);
				expect(log).toContain(name);
				expect(log).toContain(message);
				expect(log).toContain('ERROR');
				expect(format.test(log)).toBeTruthy();
			});

			it('.info and .log', function() {
				var message = 'any message';
				var format = /\d{2}:\d{2}:\d{2}\.\d+ \[NAME\] .+/;

				_console.info(message);
				expect(log).toContain(name);
				expect(log).toContain(message);
				expect(format.test(log)).toBeTruthy();

				_console.log(message);
				expect(log).toContain(name);
				expect(log).toContain(message);
				expect(format.test(log)).toBeTruthy();
			});

			it('.time and timeEnd', function() {
				var label = 'any label';
				var format = /\d{2}:\d{2}:\d{2}\.\d+ \[NAME\] any label: \d+ms/;

				_console.time(label);
				_console.timeEnd(label);
				expect(log).toContain(name);
				expect(log).toContain(label);
				expect(format.test(log)).toBeTruthy();
			});

			it('.warn', function() {
				var message = 'any message';
				var format = /\d{2}:\d{2}:\d{2}\.\d+ \[NAME\] WARN .+/;

				_console.warn(message);
				expect(log).toContain(name);
				expect(log).toContain(message);
				expect(log).toContain('WARN');
				expect(format.test(log)).toBeTruthy();
			});
		});
	});

	describe(".q", function() {
		it('.defer', function() {
			var doneMessage = 'done';
			var failMessage = 'fail';

			var deferred = ztv.q.defer();
			var resolved = false;
			expect(deferred).toBeDefined();
			deferred.promise.then(function(message) {
				expect(message).toBe(doneMessage);
				resolved = true;
			});
			deferred.resolve(doneMessage);
			expect(resolved).toBeTruthy();

			deferred = ztv.q.defer();
			var rejected = false;
			deferred.promise.then(function() {}, function(message) {
				expect(message).toBe(failMessage);
				rejected = true;
			});
			deferred.reject(failMessage);
			expect(rejected).toBeTruthy();
		});

		it('.all', function() {
			var deferred1 = ztv.q.defer();
			var deferred2 = ztv.q.defer();
			var resolved = false;

			ztv.q.all([deferred1.promise, deferred2.promise]).then(function() {
				resolved = true;
			});

			deferred1.resolve();
			deferred2.resolve();

			expect(resolved).toBeTruthy();
		});
	});

	describe(".i18n", function() {
		beforeEach(function() {
			ztv.i18n.useResources(['errors.json', 'ui.json']);
		});

		it('.useResources', function() {
			ztv.i18n.loadLocale('en-US');

			expect(ztv.i18n.getMessage('BTN_OK')).toBe("OK");
			expect(ztv.i18n.getMessage('ROUTES_NOT_AVAILABLE')).toBe("System can't get routes for default location {{ location }} from server.");
		});

		it('.loadLocale', function() {
			ztv.i18n.loadLocale('en-US');
			expect(ztv.i18n.getMessage('BTN_OK')).toBe("OK");
			expect(ztv.i18n.getMessage('ROUTES_NOT_AVAILABLE')).toBe("System can't get routes for default location {{ location }} from server.");

			ztv.i18n.loadLocale('fr-CA');
			expect(ztv.i18n.getMessage('BTN_OK')).toBe("OK");
			expect(ztv.i18n.getMessage('ROUTES_NOT_AVAILABLE')).toBe("Message on french");
		});

		it('.get', function() {
			ztv.i18n.loadLocale('en-US');

			expect(ztv.i18n.get('WIDGET_LOADING_FAILED')).toBeDefined("OK");

			expect(ztv.i18n.get('WIDGET_LOADING_FAILED').id).toBe("ASF-0410");
			expect(ztv.i18n.get('WIDGET_LOADING_FAILED').const).toBe("WIDGET_LOADING_FAILED");
			expect(ztv.i18n.get('WIDGET_LOADING_FAILED').message).toBe("Widget {{ widgetName }} is not loaded. Details: {{ error.message }}");
			expect(ztv.i18n.get('WIDGET_LOADING_FAILED').description).toBe("Request widget template, code, styles: {{details}}.");

			expect(ztv.i18n.get('WIDGET_LOADING_FAILED', {widgetName: 'Traffic', error: {message: 'no details'}}).message).toBe("Widget Traffic is not loaded. Details: no details");
			expect(ztv.i18n.get('WIDGET_LOADING_FAILED', {details: 'test test'}).description).toBe("Request widget template, code, styles: test test.");

			expect(ztv.i18n.get('no such const').id).toBe('');
			expect(ztv.i18n.get('no such const').const).toBe('no such const');
			expect(ztv.i18n.get('no such const').message).toBe('no such const');
			expect(ztv.i18n.get('no such const').description).toBe('');
		});

		it('.getMessage', function() {
			ztv.i18n.loadLocale('en-US');

			expect(ztv.i18n.getMessage('WIDGET_LOADING_FAILED')).toBe("Widget {{ widgetName }} is not loaded. Details: {{ error.message }}");
			expect(ztv.i18n.getMessage('WIDGET_LOADING_FAILED', {widgetName: 'Traffic', error: {message: 'no details'}})).toBe("Widget Traffic is not loaded. Details: no details");

			expect(ztv.i18n.getMessage('no such const')).toBe('no such const');
		});
	});

	describe(".settings", function() {
		it('.getNamespace', function() {
			var ns = ztv.settings.getNamespace('_test_namespace_');
			expect(ns).toBeDefined();
		});

		it('.set + .get', function() {
			var ns = ztv.settings.getNamespace('_test_namespace_');
			var key = '_test_key_';
			var value = '_test_value_';
			var success = false;

			ns.remove(key).then(function() {
				ns.set(key, value).then(function() {
					ns.get(key).then(function(v) {
						expect(v).toBe(value);
						success = true;
					});
				});
			});

			waitsFor(function() {
				return success;
			}, 'all operation complete', 1000);
		});

		it('.remove', function() {
			var ns = ztv.settings.getNamespace('_test_namespace_');
			var key = '_test_key_';
			var value = '_test_value_';
			var success = false;

			ns.set(key, value).then(function() {
				ns.get(key).then(function(v) {
					expect(v).toBe(value);
					ns.remove(key).then(function() {
						ns.get(key).then(function(v) {
							expect('Key not removed').toBe('');
						}, function() {
							success = true;
						});
					}, function() {
						expect('Fail to remove value').toBe('');
					});
				});
			});

			waitsFor(function() {
				return success;
			}, 'Key deleted', 1000);
		});

		it('.clearNamespace', function() {
			var name = '_test_namespace_';
			var ns = ztv.settings.getNamespace(name);
			var key = '_test_key_';
			var value = '_test_value_';
			var success = false;

			ns.set(key, value).then(function() {
				ns.get(key).then(function(v) {
					expect(v).toBe(value);
					ztv.settings.clearNamespace(name).then(function() {
						ns.get(key).then(function() {
							expect('Key not deleted').toBe('');
						}, function() {
							success = true;
						});
					});
				});
			});

			waitsFor(function() {
				return success;
			}, 'Key deleted', 1000);
		});
	});
});
