var hasOwnProp = Object.prototype.hasOwnProperty;
module.exports = deep
function deep (obj, path, value, removeq) {
    if (path[0]=="/") path = path.slice(1)
    if (arguments.length === 3) return set.apply(null, arguments);
    if (arguments.length === 4) return remove.apply(null, arguments);
    return get.apply(null, arguments);
  }
deep.p = true
function get (obj, path) {
    var keys = Array.isArray(path) ? path : path.split('/');
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (!obj || !hasOwnProp.call(obj, key)) {
        obj = undefined;
        break;
      }
      obj = obj[key];
    }
    return obj;
}
function set (obj, path, value) {
    var keys = Array.isArray(path) ? path : path.split('/');
    for (var i = 0; i < keys.length - 1; i++) {
      var key = keys[i];
      if (deep.p && !hasOwnProp.call(obj, key)) obj[key] = {};
      obj = obj[key];
    }
    obj[keys[i]] = value;
    return value;
}
function remove (obj, path, value) {
    var keys = Array.isArray(path) ? path : path.split('/');
    for (var i = 0; i < keys.length - 1; i++) {
      var key = keys[i];
      if (deep.p && !hasOwnProp.call(obj, key)) obj[key] = {};
      obj = obj[key];
    }
    delete obj[keys[i]];
    return value
}