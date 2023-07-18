
module.exports = {

  views: {
    titles: {
      map: function(doc) {
        if (doc.type_ === 'Article') {
          emit(doc._id, doc.title);
        }
      }
    }
  },
  indexes: {
    titles: {
      index: function(doc) {
        index('default', doc.title);
      }
    }
  }

};