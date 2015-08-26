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
