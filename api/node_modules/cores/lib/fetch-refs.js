var Q = require('kew');
var common = require('./common.js');


//
// collect all ref objs and ref ids from a document
//
function addRefs(doc, refs) {

  common.walkObject(doc, function(obj, key, value) {

    if (value && typeof value === 'object' && value.id_) {
      if (!refs[value.id_]) {
        refs[value.id_] = [value];
      }
      else {
        refs[value.id_].push(value);
      }
    }
  });
}


module.exports = function fetchRefs(cores, docs, deep) {

  deep = deep || false;
  var refs = {};
  docs.forEach(function(doc) {
    addRefs(doc, refs);
  });
  var ids = Object.keys(refs);
  if (ids.length === 0) return Q.resolve(docs);

  return cores.fetch(ids, { include_docs: true }).then(function(result) {

    // merge docs into ref objects
    var refDocs = result.rows.map(function(row) {
      refs[row.id].forEach(function(ref) {
        common.merge(ref, row.doc);
      });
      return row.doc;
    });

    // recursively fetch refs of refs
    if (deep && refDocs.length) {
      return fetchRefs(cores, refDocs, deep).then(function() {
        return docs;
      });
    }

    return docs;
  });
};
