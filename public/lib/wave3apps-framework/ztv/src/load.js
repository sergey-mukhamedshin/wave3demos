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
