var path = require('path');
var J = require('jski')();
var walk = require('walk-fs');
var Q = require('kew');


function camelize(str) {
  return str.replace(/(^\w)|(\-\w)/g, function(m) {
    return m.slice(-1).toUpperCase();
  });
};


function extend(a, b) {
  for (var x in b) a[x] = b[x];
  return a;
};


module.exports = function loadResources(cores, dir, context, syncDesign) {

  var defer = Q.defer();
  if (!dir) {
    return Q.resolve({});
  }

  dir = path.resolve(dir);

  var configs = {};
  var re = /\/([^_][\w\-]+)-(schema|design)\.js$/i;

  walk(dir, { recursive: true }, function(path, stats) {

    if (stats.isFile()) {
      var parts = path.match(re);

      if (parts) {
        var name = parts[1].toLowerCase();
        var type = parts[2].toLowerCase();
        var cname = camelize(name);
        var config = configs[cname] = configs[cname] || {};

        var def = require(path);
        // when required module is a function, execute it with context
        if (typeof def === 'function') {
          def = def(context);
        }
        // convert pure json schemas to jski schemas
        if (type === 'schema' && !def.__jski__) {
          def = J.createValidator(def);
        }
        config[type] = def;
      }
    }
  }, function(err) {
    if (err) return defer.reject(err);

    var keys = Object.keys(configs);
    var numRes = keys.length;
    var resources = {};

    var promises = Object.keys(configs).map(function(name) {

      var config = configs[name];
      config.validateRefs = false;
      return cores.create(name, config, syncDesign).then(function(res) {
        resources[name] = res;
      });
    });

    Q.all(promises).then(function() {
      defer.resolve(resources);
    }, function(err) {
      defer.reject(err);
    });
  });

  return defer.promise;
};
