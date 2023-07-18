var util = require('util');


module.exports.merge = function merge(a, b) {
  for (var n in b) {
    a[n] = b[n];
  }
  return a;
};


module.exports.walkObject = function walkObject(obj, iterator) {

  for (var key in obj) {
    walk(obj, key);
  }

  function walk(obj, key) {

    var value = obj[key];
    var r = iterator(obj, key, value);
    if (typeof r === 'boolean' && !r) return;

    if (util.isArray(value)) {
      for (var i = 0; i < value.length; ++i) {
        walk(value, i);
      }
    }
    else if (value && typeof value === 'object') {
      for (var m in value) {
        walk(value, m);
      }
    }
  }
};
