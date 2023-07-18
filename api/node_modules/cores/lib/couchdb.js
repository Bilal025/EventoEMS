var Url = require('url');
var Q = require('kew');
var Request = require('request');


function checkError(err, req, res, body) {
  if (err) {
    return err;
  }
  if (res.statusCode < 400) {
    return null;
  }
  var payload = typeof body === 'string' ? JSON.parse(body) : body;
  var cErr = new Error(payload.reason || 'couch returned ' + res.statusCode);
  cErr.statusCode = res.statusCode,
  cErr.request = req;
  cErr.response = res;
  return cErr;
}


function stringifySearchParams(qs) {
  var s = {};
  Object.keys(qs).forEach(function(key) {
    if (typeof qs[key] !== 'string') {
      try {
        s[key] = JSON.stringify(qs[key]);
      }
      catch(e) {
      }
    }
    else if ((key === 'key' || key === 'startkey' || key === 'endkey' || key === 'keys')
             && (qs[key].charAt(0) !== '\"' && qs[key].charAt(0) !== '[')) {
      s[key] = '\"' + qs[key] + '\"';
    }
    else {
      s[key] = qs[key];
    }
  });
  return s;
}


module.exports = function(db) {

  // db can be an url or an object of type { url, [user, pass] }

  var dbUrl = typeof db === 'string' ? db : db.url;
  var auth = db.user && db.pass ? { user: db.user, pass: db.pass } : '';

  if (!dbUrl) {
    throw new Error('No couchdb url given');
  }

  return {
    //
    // load document by id
    //
    load: function load(id, qs) {
      var defer = Q.defer();
      var req = Request({
        method: 'GET',
        url: dbUrl + '/' + id,
        auth: auth,
        qs: qs
      }, function(resErr, res, body) {
        var err = checkError(resErr, req, res, body);
        if (err) {
          return defer.reject(err);
        }
        defer.resolve(JSON.parse(body));
      });
      return defer.promise;
    },


    //
    // save document
    //
    save: function save(doc, qs) {
      var defer = Q.defer();
      var method = 'POST';
      var url = dbUrl;
      qs = qs || {};

      function replacer(key, value) {
        if (typeof value === 'function') {
          return value.toString();
        }
        return value;
      }

      if (doc._id) {
        // create or update with id
        method = 'PUT';
        url += '/' + doc._id;
        if (doc._rev) {
          // update with rev
          qs.rev = doc._rev;
        }
      }

      var req = Request({
        method: method,
        url: url,
        auth: auth,
        qs: qs,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: typeof doc === 'string' ? doc : JSON.stringify(doc, replacer)

      }, function(resErr, res, body) {
        var err = checkError(resErr, req, res, body);
        if (err) {
          return defer.reject(err);
        }
        defer.resolve(JSON.parse(body));
      });
      return defer.promise;
    },


    //
    // save array of documents
    //
    bulkSave: function bulkSave(docs, qs) {
      var defer = Q.defer();
      var req = Request({
        method: 'POST',
        url: dbUrl + '/_bulk_docs',
        auth: auth,
        qs: qs,
        json: docs

      }, function(resErr, res, body) {
        var err = checkError(resErr, req, res, body);
        if (err) {
          return defer.reject(err);
        }
        defer.resolve(body);
      });
      return defer.promise;
    },


    //
    // load documents by ids
    //
    bulkLoad: function bulkLoad(keys, qs) {
      var defer = Q.defer();
      var req = Request({
        method: 'POST',
        url: dbUrl + '/_all_docs',
        auth: auth,
        qs: qs,
        json: { keys: keys || [] }
      }, function(resErr, res, body) {
        var err = checkError(resErr, req, res, body);
        if (err) {
          return defer.reject(err);
        }
        defer.resolve(body);
      });
      return defer.promise;
    },


    //
    // delete document
    //
    destroy: function destroy(id, rev) {
      var defer = Q.defer();
      var qs = { rev: rev };

      var req = Request({
        method: 'DELETE',
        url: dbUrl + '/' + id,
        auth: auth,
        qs: qs
      }, function(resErr, res, body) {
        var err = checkError(resErr, req, res, body);
        if (err) {
          return defer.reject(err);
        }
        defer.resolve(JSON.parse(body));
      }
                       );
      return defer.promise;
    },


    //
    // call design view
    //
    view: function view(designName, viewName, qs) {
      var defer = Q.defer();
      var req = Request({
        method: 'GET',
        url: dbUrl + '/_design/' + designName + '/_view/' + viewName,
        auth: auth,
        qs: stringifySearchParams(qs)
      }, function(resErr, res, body) {
          var err = checkError(resErr, req, res, body);
          if (err) {
            return defer.reject(err);
          }
          defer.resolve(JSON.parse(body));
        }
      );
      return defer.promise;
    },


    //
    // call search index
    //
    search: function(designName, indexName, qs) {
      var defer = Q.defer();
      var req = Request({
        method: 'GET',
        url: dbUrl + '/_design/' + designName + '/_search/' + indexName,
        auth: auth,
        qs: stringifySearchParams(qs)
      }, function(resErr, res, body) {
          var err = checkError(resErr, req, res, body);
          if (err) {
            return defer.reject(err);
          }
          defer.resolve(JSON.parse(body));
        }
      );
      return defer.promise;
    },


    //
    // get a bunch of fresh uuids
    //
    uuids: function uuids(count) {
      count = count || 1;
      var defer = Q.defer();
      var parts = Url.parse(dbUrl);
      var req = Request({
        method: 'GET',
        url: parts.protocol + '//' + parts.host + '/_uuids',
        auth: auth,
        qs: { count: count }
      }, function(resErr, res, body) {
          var err = checkError(resErr, req, res, body);
          if (err) {
            return defer.reject(err);
          }
          defer.resolve(JSON.parse(body));
        }
      );
      return defer.promise;
    },


    //
    // database info
    //
    info: function info() {
      var defer = Q.defer();
      var req = Request({
        method: 'GET',
        url: dbUrl,
        auth: auth
      }, function(resErr, res, body) {
          var err = checkError(resErr, req, res, body);
          if (err) {
            return defer.reject(err);
          }
          defer.resolve(JSON.parse(body));
        }
      );
      return defer.promise;
    },


    //
    // create a database
    //
    createDB: function createDB(name) {
      var defer = Q.defer();
      var req = Request({
        method: 'PUT',
        url: dbUrl,
        auth: auth
      }, function(resErr, res, body) {
          var err = checkError(resErr, req, res, body);
          if (err) {
            return defer.reject(err);
          }
          defer.resolve(JSON.parse(body));
      });
      return defer.promise;
    },


    //
    // destroy a database
    //
    destroyDB: function destroyDB(name) {
      var defer = Q.defer();
      var req = Request({
        method: 'DELETE',
        url: dbUrl,
        auth: auth
      }, function(resErr, res, body) {
          var err = checkError(resErr, req, res, body);
          if (err) {
            return defer.reject(err);
          }
          defer.resolve(JSON.parse(body));
      });
      return defer.promise;
    }
  };
};