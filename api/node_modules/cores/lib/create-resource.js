var Q = require('kew');
var J = require('jski')();
var Resource = require('./resource.js');


var resourceSchema = J.object({
  title: J.string(),
  description: J.string(),
  properties: J.object({
    type: J.enum(['object']),
    properties: J.object()
  }),
  default: J.any()
});


var designSchema = J.object({
  title: J.string(),
  description: J.string(),
  views: J.object(),
  shows: J.object(),
  lists: J.object()
});


//
// create a resource
//
module.exports = function createResource(cores, name, config, syncNow) {

  var err, errs;

  if (config.schema) {
    errs = resourceSchema.validate(config.schema);
    if (errs.length) {
      err = new Error('Resource schema does not validate');
      err.errors = errs;
      return Q.reject(err);
    }
  }

  if (config.design) {
    errs = designSchema.validate(config.design);
    if (errs.length) {
      err = new Error('Resource design does not validate');
      err.errors = errs;
      return Q.reject(err);
    }
  }

  var res = new Resource(cores, name, config);

  if (!syncNow) {
    return Q.resolve(res);
  }
  else {
    return res.sync().then(function() {
      return res;
    });
  }
};
