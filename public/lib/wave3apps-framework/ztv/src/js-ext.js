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
