'use strict';

var platform = new (function () {
	this.loadScript = function (path, onSuccess, onFailure) {
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.async = true;
		script.src = path;

		script.onload = script.onreadystatechange = function () {
			if (!this.readyState || this.readyState == 'complete')
				onSuccess();
		};

		script.onerror = onFailure;

		document.body.appendChild(script);
	};

	var supported = [];

	this.add = function (platformCreator) {
		supported.push(platformCreator());
	};

	this.get = function (name) {
		for (var i = 0; i < supported.length; ++i)
			if (supported[i].name == name)
				return supported[i];
		return null;
	};

	function detectPlatform() {
		var ua = window.navigator.userAgent;

		while (supported.length) {
			var platformInstance = supported.pop();
			if (new RegExp(platformInstance.userAgent).test(ua)) {
				for (var property in platformInstance)
					platform[property] = platformInstance[property];
				return;
			}
		}
		throw 'Platform not detected!';
	}

	this.runApplication =  function (appName, onSuccess, onFailure) {
		function run() {
			platform.initialize();
			//platform.print(platform.name + ' platform loaded [' + window.navigator.userAgent + ']');

			onSuccess();
			angular.bootstrap(document, [appName]);
		}
		
		window.onload = function () {
			detectPlatform();
			var depCount = platform.dependencies.length;

			if (depCount) {
				var failed = false;
				for (var i = 0; i < depCount; ++i) {
					platform.loadScript(platform.dependencies[i],
						function () {
							if (--depCount == 0) {
								//log('platform\'s dependencies loaded');
								run();
							}
						},
						function () {
							if (!failed) {
								//log('failed to load platform\'s dependencies');
								failed = true;
								if (onFailure) onFailure();
							}
						});
				}
			} else {
				//log('no platform\'s dependencies declared');
				run();
			}
		};
	};
})();