var Util = require('util');
var Q = require('kew');

var Couchdb = require('./lib/couchdb');

var Common = require('./lib/common.js');
var createResource = require('./lib/create-resource.js');
var loadResources = require('./lib/load-resources.js');
var fetchRefs = require('./lib/fetch-refs.js');


module.exports = function(options) {

  var couchdb = Couchdb(options);

  return {

    resources: {},
    couchdb: couchdb,

    //
    // fetch a couple of documents by keys
    //
    fetch: function(keys, query) {
      return couchdb.bulkLoad(keys, query);
    },


    //
    // fetch documents refs
    //
    fetchRefs: function(docs, deep) {
      if (Util.isArray(docs)) {
        // fetch refs of array of document
        return fetchRefs(this, docs, deep);
      }
      else if (typeof docs === 'object' && docs) {
        // fetch refs of single document
        return fetchRefs(this, [docs], deep).then(function(result) {
          return result[0];
        });
      }
      return null;
    },


    //
    // get a number of fresh uuids from couchdb
    //
    uuids: function(count) {
      return couchdb.uuids(count);
    },


    //
    // create a new resource object
    //
    create: function(name, config, syncNow) {
      var self = this;
      return createResource(this, name, config, syncNow).then(function(res) {
        self.resources[res.name] = res;
        return res;
      });
    },


    //
    // load resource definitions from a directory
    //
    load: function(dir, context, syncDesign) {
      var self = this;
      return loadResources(this, dir, context, syncDesign).then(function(resources) {
        Common.merge(self.resources, resources);
        return resources;
      });
    },


    //
    // sync all design docs with the database
    // Warning: this will update the view index
    //
    sync: function() {
      var self = this;
      var pms = [];
      Object.keys(this.resources).forEach(function(key) {
        pms.push(self.resources[key].sync());
      });
      return Q.all(pms);
    },

    //
    // Get info on current db
    //
    info: function() {
      return couchdb.info();
    }
  };
};
