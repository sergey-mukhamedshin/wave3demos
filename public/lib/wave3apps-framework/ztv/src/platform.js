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
