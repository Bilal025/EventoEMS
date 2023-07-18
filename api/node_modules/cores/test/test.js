/*global before after beforeEach afterEach describe it*/

var Q = require('kew');
var Cores = require('../index.js');
var Couchdb = require('../lib/couchdb.js');

var Util = require('util');
var assert = require('assert');

var articleSchema = require('./resources/article-schema.js');
var articleDesign = require('./resources/article-design.js');
var articleData = require('./article-data.js');

var db = 'http://localhost:5984/test-cores';
var couchdb = Couchdb(db);


function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}


function createDocs(res, numDocs) {
  var docs = [];
  var promises = [];

  for (var i = 0; i < numDocs; ++i) {
    var d = clone(articleData);
    d.title = d.title + ' ' + i;
    promises.push(res.save(d).then(function(doc) {
      docs.push(doc);
    }));
  }
  return Q.all(promises).then(function() {
    return docs;
  });
}


function destroyDocs(res, docs) {
  var promises = [];
  docs.forEach(function(doc) {
    promises.push(res.destroy(doc));
  });
  return Q.all(promises);
}


var cores;
var dbName = 'test-cores';

describe('cores', function() {

  // create db before tests and destroy afterwards
  before(function(done) {

    cores = Cores('http://localhost:5984/' + dbName);

    couchdb.info().then(function() {
      return couchdb.destroyDB().then(function() {
        return couchdb.createDB();
      });
    }, function(err) {
      return couchdb.createDB();

    }).then(function() {
      done();
    }, done);
  });

  after(function(done) {
    couchdb.destroyDB().then(function() { done(); }, done);
  });


  describe('resource', function() {

    // test data
    var resName = 'Article';
    var resName2 = 'Foo';


    describe('create', function() {

      it('should create with schema', function(done) {
        cores.create(resName, { schema: articleSchema }).then(function(r) {
          assert(typeof r === 'object');
          assert(cores.resources[r.name]);
          done();
        }, done);
      });


      it('should have methods defined', function() {
        var res = cores.resources[resName];
        assert(typeof res.load === 'function');
        assert(typeof res.save === 'function');
        assert(typeof res.destroy === 'function');
        assert(typeof res.view === 'function');
        assert(typeof res.search === 'function');
      });


      it('should create without schema', function(done) {
        cores.create(resName, {}).then(function(r) {
          assert(typeof r === 'object');
          done();
        }, done);
      });


      it('should have properties defined', function(done) {
        cores.create(resName, { schema: articleSchema }).then(function(r) {
          assert(r.cores === cores);
          assert(r.name === resName);
          assert(typeof r.schema === 'object');
          assert(typeof r.design === 'object');
          done();
        }, done);
      });


      it('should not create with invalid schema', function(done) {
        cores.create(resName, { schema: { properties: { type: 'boolean' }}}).then(function(r) {
          assert(false);
        }, function(err) {
          assert(Util.isError(err));
          done();
        });
      });


      it('should not create with invalid design', function(done) {
        cores.create(resName, { schema: articleSchema, design: { views:'' } }).then(function(r) {
          assert(false);
        }, function(err) {
          assert(Util.isError(err));
          done();
        });
      });


      it('should create with schema and design', function(done) {
        cores.create(resName, { schema: articleSchema, design: articleDesign }).then(function(r) {
          done();
        }, done);
      });
    });


    describe('load', function() {

      it('should load resources from directory', function(done) {
        cores.load('./test/resources').then(function(res) {
          assert(res.Article);
          assert(cores.resources.Article);
          done();
        }, done);
      });

      it('should not load from invalid directory', function(done) {
        cores.load('./test/foo').then(function(res) {
          assert(false);
        }, function(err) {
          assert(Util.isError(err));
          done();
        });
      });

      it('should load resources with context', function(done) {
        var context = { test: false };
        cores.load('./test/resources', context).then(function(res) {
          assert(context.test);
          done();
        }, done);
      });

      it('should ignore files with leading underscore when loading', function(done) {
        cores.load('./test/resources').then(function(res) {
          assert(!res.Underscore);
          done();
        }, done);
      });
    });


    describe('sync', function() {

      it('should sync design to db', function(done) {
        cores.load('./test/resources').then(function(resources) {
          return resources.Article.sync().then(function() {
            return couchdb.load('_design/' + resources.Article.design.name).then(function(doc) {
              assert(doc.views.all);
              assert(doc.views.titles);
              assert(doc.indexes.titles);
              done();
            });
          });
        }, done);
      });


      it('should sync all design to db', function(done) {
        cores.create(resName2, {}).then(function(r) {
          return cores.sync().then(function() {
            return couchdb.load(
              '_design/' + cores.resources.Article.design.name

            ).then(function(doc) {
              assert(doc.views.all);
              done();
            });
          });
        }, done);
      });
    });


    describe('crud', function() {

      var doc = clone(articleData);
      var res = null;

      before(function(done) {
        cores.load('./test/resources').then(function(resources) {
          res = resources.Article;
          done();
        }, done);
      });


      it('should not validate data without required properties', function(done) {
        res.validate({ type_: 'Article' }).then(function(doc) {
          assert(false);
        }, function(err) {
          assert(Util.isError(err));
          done();
        });
      });


      it('should validate with required properties', function(done) {
        res.validate(articleData).then(function(doc) {
          done();
        }, done);
      });


      it('should not save when not valid', function(done) {
        res.save({ type_: 'Article' }).then(function(doc) {
          assert(false);
        }, function(err) {
          assert(Util.isError(err));
          done();
        });
      });


      it('should save when valid', function(done) {
        res.save(doc).then(function(d) {
          assert(typeof d._id === 'string');
          assert(typeof d._rev === 'string');
          done();
        }, done);
      });


      it('should save when updated', function(done) {
        doc.title = 'Some other title';
        res.save(doc).then(function(d) {
          assert(d._id === doc._id);
          assert(d._rev === doc._rev);
          done();
        }, done);
      });


      it('should not save when has wrong type', function(done) {
        res.save({ _id: 'somefoo', type_: 'Foo' }).then(function(d) {
          assert(false);
        }, function(err) {
          assert(Util.isError(err));
          done();
        });
      });


      it('should load', function(done) {
        res.load(doc._id).then(function(d) {
          assert(d.title === doc.title);
          done();
        }, done);
      });


      it('should not load nonexistant doc', function(done) {
        res.load('fooo').then(function(doc) {
          assert(false);
        }, function(err) {
          assert(Util.isError(err));
          done();
        });
      });


      it('should destroy', function(done) {
        res.destroy(doc).then(function() {
          done();
        }, done);
      });


      it('should not destroy nonexistant doc', function(done) {
        res.destroy({ _id: 'foo', _rev: 'bar' }).then(function() {
          assert(false);
        }, function(err) {
          assert(Util.isError(err));
          done();
        });
      });


      it('should save with id', function(done) {
        var d = clone(doc);
        delete d._rev;
        d._id = 'my-id';

        res.save(d).then(function(saveDoc) {
          return res.load('my-id');

        }).then(function(loadedDoc) {
          return res.destroy(loadedDoc);

        }).then(function() {
          done();
        }, done);
      });
    });


    describe('views', function() {

      var docs = [];
      var numDocs = 3;
      var res = null;
      var id = '';

      before(function(done) {
        res = cores.resources.Article;
        createDocs(res, numDocs).then(function(result) {
          docs = result;
          done();
        }, done);
      });

      after(function(done) {
        destroyDocs(res, docs).then(function() {
          done();
        }, done);
      });


      it('should call the all view with no params', function(done) {
        res.view('all').then(function(result) {
          assert(result.total_rows === numDocs);
          done();
        }, done);
      });


      it('should call the all view with params', function(done) {
        res.view('all', { limit: 2  }).then(function(result) {
          assert(result.total_rows === numDocs);
          assert(result.rows.length === 2);
          id = result.rows[0].id;
          done();
        }, done);
      });


      it('should call the titles view', function(done) {
        res.view('titles').then(function(result) {
          assert(result.total_rows === numDocs);
          done();
        }, done);
      });


      it('should call the titles view with params', function(done) {
        res.view('titles', { limit: 1 }).then(function(result) {
          assert(result.total_rows === numDocs);
          assert(result.rows.length === 1);
          done();
        }, done);
      });


      it('should call the view with string params', function(done) {
        res.view('titles', { key: id }).then(function(result) {
          assert(result.total_rows === numDocs);
          assert(result.rows.length === 1);
          done();
        }, done);
      });


      it('should respond with error when view does not exist', function(done) {
        res.view('foo').then(function(result) {
          assert(false);
        }, function(err) {
          assert(Util.isError(err));
          done();
        });
      });
    });


    describe('search', function() {
      // TODO
    });
  });




  describe('fetch docs', function() {

    var resName = 'Article';
    var resource = null;

    before(function(done) {
      cores.create(resName, { schema: articleSchema }, true).then(function(r) {
        resource = r;
        r.save(clone(articleData)).then(function(doc) {
          done();
        }, done());
      });
    });

    it('should fetch docs', function(done) {

      resource.view('all').then(function(result) {
        var keys = result.rows.map(function(row) { return row.id; });
        cores.fetch(keys).then(function(result) {
          assert(result.rows.length > 0);
          done();
        }, done);
      }, done);
    });
  });


  describe('map', function() {

    var docs = [];
    var numDocs = 3;
    var res = null;

    before(function(done) {
      res = cores.resources.Article;
      createDocs(res, numDocs).then(function(result) {
        docs = result;
        done();
      }, done);
    });

    after(function(done) {
      destroyDocs(res, docs).then(function() {
        done();
      }, done);
    });


    it('should update a couple of documents', function(done) {

      res.map('all', function(doc) {
        doc.mapTest = true;
        return doc;

      }).then(function() {

        return cores.fetch(
          docs.map(function(doc) {
            return doc._id;
          }),
          { include_docs: true }

        ).then(function(result) {
          result.rows.forEach(function(row, i) {
            assert(row.doc.mapTest);
            docs[i]._rev = row.doc._rev;
          });
          done();
        });
      }, done);
    });
  });


  describe('fetch refs', function() {
    var resName = 'Article';
    var resource = null;
    var doc1, doc2, doc3, doc4;

    before(function(done) {
      cores.create(resName, { schema: articleSchema }, true).then(function(r) {
        resource = r;
        var data1 = clone(articleData);
        data1.title = 'the first one';
        var data2 = clone(articleData);
        data2.title = 'the second one';
        var data3 = clone(articleData);
        data3.title = 'the third one';
        var data4 = clone(articleData);
        data4.title = 'the fourth one';

        r.save(data1).then(function(doc) {
          doc1 = doc;
          data2.other = { id_: doc1._id };
          return r.save(data2);

        }).then(function(doc) {
          doc2 = doc;
          data3.other1 = { id_: doc1._id };
          data3.other2 = { id_: doc2._id };
          return r.save(data3);

        }).then(function(doc) {
          doc3 = doc;
          data4.other3 = { id_: doc3._id };
          return r.save(data4);

        }).then(function(doc) {
          doc4 = doc;

          done();
        }, done);
      });
    });

    it('should fetch refs of single doc', function(done) {
      cores.fetchRefs(doc2).then(function(doc) {
        assert(doc.other.title === 'the first one');
        done();
      }, done);
    });

    it('should fetch refs of multiple docs', function(done) {
      var keys = [doc2._id, doc3._id];
      resource.view('all', { keys: keys, include_docs: true }).then(function(result) {
        var docs = result.rows.map(function(row) {
          return row.doc;
        });

        return cores.fetchRefs(docs).then(function(docs) {
          var d2 = docs[0]._id === doc2._id ? docs[0] : docs[1];
          var d3 = docs[0]._id === doc2._id ? docs[1] : docs[0];
          assert(d2.other.title === 'the first one');
          assert(d3.other1.title === 'the first one');
          assert(d3.other2.title === 'the second one');
          done();
        }, done);
      }, done);
    });

    it('should fetch refs deep', function(done) {

      resource.load(doc4._id).then(function(doc) {
        return cores.fetchRefs(doc, true).then(function(doc) {
          assert(doc.other3.other2.other.title === 'the first one');
          done();
        }, done);
      }, done);
    });
  });


  describe('uuids', function() {

    it('should get a uuid', function(done) {
      cores.uuids().then(function(result) {
        assert(result.uuids.length === 1);
        done();
      }, done);
    });

    it('should get multiple uuids', function(done) {
      cores.uuids(5).then(function(result) {
        assert(result.uuids.length === 5);
        done();
      }, done);
    });
  });


  describe('info', function() {
    it('should get the db info', function(done) {
      cores.info().then(function(info) {
        assert(info.db_name === dbName);
        done();
      }, done);
    });
  });


  describe('auth', function() {
    // TODO: real test with existing user
    cores = Cores({
      url: 'http://localhost:5984/' + dbName,
      user: 'admin',
      pass: 'admin'
    });

    it('should successfully call the db', function(done) {
      cores.info().then(function(info) {
        done();
      }, done);
    });
  });

});