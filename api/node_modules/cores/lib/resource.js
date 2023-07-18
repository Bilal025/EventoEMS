var Q = require('kew');
var J = require('jski')();


//
// Resource contructor
//
function Resource(cores, name, config) {

  this.cores = cores;
  this.couchdb = cores.couchdb;

  this.name = name;
  this.design = config.design || {};

  this.validateRefs = config.validateRefs || false;

  this.schema = config.schema || J.object();
  if (!this.schema.__jski__) {
    // wrap schema in jski schema validator
    this.schema = J.createValidator(this.schema);
  }

  this.design.name = this.name.toLowerCase();
  this.design._id = '_design/' + this.design.name;
  this.design.views = this.design.views || {};
  this.design.indexes = this.design.indexes || {};

  // add an all view, to get all docs of this resource type
  if (!this.design.views.all) {
    this.design.views.all = {
      // set map function as string, to hardcode the value of name into it
      map: 'function(doc) { if (doc.type_ === \"' + this.name + '\") { emit(doc._id, null); }}'
    };
  }
}


//
// Sync design with couchdb
//
Resource.prototype.sync = function() {

  var self = this;

  return self.couchdb.load(self.design._id).then(function(doc) {
    self.design._rev = doc._rev;
    return self.couchdb.save(self.design);

  }, function(err, resp) {
    if (err.statusCode === 404) {
      return self.couchdb.save(self.design);
    }
    return err;
  });
};


//
// Call a couchdb design view
//
Resource.prototype.view = function(name, qs) {

  qs = qs || {};

  if (!this.design.views[name]) {
    var err = new Error('Resource view not found: ' + name + '.');
    err.code = 404;
    return Q.reject(err);
  }

  return this.couchdb.view(this.design.name, name, qs);
};


//
// Call a couchdb search index
//
Resource.prototype.search = function(name, qs) {

  qs = qs || {};

  if (!this.design.indexes[name]) {
    var err = new Error('Resource search index not found: ' + name + '.');
    err.code = 404;
    return Q.reject(err);
  }

  return this.couchdb.search(this.design.name, name, qs);
};


//
// Validate a document
//
Resource.prototype.validate = function(doc) {

  var errs = this.schema.validate(doc, { omitRefs: !this.validateRefs });
  if (errs.length) {
    var valErr = new Error('Validation failed', errs);
    valErr.code = 400;
    valErr.errors = errs;
    return Q.reject(valErr);
  }
  return Q.resolve(doc);
};


//
// Load a document from the DB
//
Resource.prototype.load = function(id) {

  var self = this;
  var defer = Q.defer();

  return this.couchdb.load(id).then(function(doc) {
    if (!doc.type_ || !(typeof doc.type_ === 'string')) {
      var typeErr = new Error('Doc has wrong type.');
      typeErr.code = 400;
      throw typeErr;
    }
    return doc;
  });
};


//
// Save a document to the DB
//
Resource.prototype.save = function(doc) {

  var self = this;

  // enforce type
  doc.type_ = this.name;

  // always validate before saving
  return this.validate(doc).then(function(doc) {

    return self.couchdb.save(doc).then(function(result) {
      doc._id = result.id;
      doc._rev = result.rev;
      return doc;
    });
  });
};


//
// Delete document from the DB
//
Resource.prototype.destroy = function(doc) {

  // var self = this;

  if (!doc._id || !doc._rev) {
    var err = new Error('Destroy needs an id and rev.');
    err.code = 400;
    return Q.reject(err);
  }
  return this.couchdb.destroy(doc._id, doc._rev);
};


//
// Load a bunch of docs, call the map function on them, and save them
// Warning: This may trigger rebuilding the view index for a lot of docs
//
Resource.prototype.map = function(viewName, viewParams, fn) {

  viewName = viewName || 'all';
  if (typeof viewParams === 'function') {
    fn = viewParams;
    viewParams = null;
  }
  var self = this;

  return this.view(viewName, viewParams || { include_docs: true }).then(function(result) {

    var docs = result.rows.map(function(row, index) {
      var d = fn(row.doc);
      if (typeof d !== 'object' || !d) {
        throw new Error('Map function result must be an object');
      }
      if (!d._id) {
        throw new Error('Map function result must have an _id');
      }
      if (!d._rev) {
        throw new Error('Map function result must have an _rev');
      }
      if (d.type_ !== self.name) {
        throw new Error('Map function result must have correct type');
      }
      return d;
    });

    return self.couchdb.bulkSave({ docs: docs });
  });
};


module.exports = Resource;
