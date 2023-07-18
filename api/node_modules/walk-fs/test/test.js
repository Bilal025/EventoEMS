var path = require('path');
var assert = require('assert');

var walk = require('../index.js');


function removeItem(arr, item) {
  var i = arr.indexOf(item);
  if (i === -1) return false;
  arr.splice(i, 1);
  return true;
}


describe('walk-fs', function() {

  it('should walk a directory recursively', function(done) {

    var items = [
      '/a/b', '/a/b/c', '/a/foo', '/a/b/bar', '/a/b/c/baz'
    ].map(function(item) {
      return path.join(__dirname, item);
    });
    
    walk(path.join(__dirname, 'a'), function(path, stats) {
      assert(removeItem(items, path));
      
    }, function(err) {
      assert(!err);
      assert(items.length === 0);
      done();
    });
  });


  it('should walk a directory', function(done) {

    var items = [
      '/a/b', '/a/foo'
    ].map(function(item) {
      return path.join(__dirname, item);
    });
    
    walk(path.join(__dirname, 'a'), { recursive: false }, function(path, stats) {
      assert(removeItem(items, path));

    }, function(err) {
      assert(!err);
      assert(items.length === 0);
      done();
    });
  });


  it('should stop walking', function(done) {

    var calls = 0;
    
    walk(path.join(__dirname, 'a'), function(path, stats) {
      ++calls;
      return false;
      
    }, function(err) {
      assert(!err);
      assert(calls === 1);
      done();
    });
  });


  it('should invoke the callback on error', function(done) {

    walk(path.join(__dirname, 'not'), function(path, stats) {
      assert(false);
      
    }, function(err) {
      assert(err);
      done();
    });
  });
});

