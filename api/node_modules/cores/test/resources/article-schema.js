var J = require('jski')();

module.exports = J.object({

  title: J.string(),
  author: J.object({
    firstname: J.string(),
    lastname: J.string()
  }),
  tags: J.array(J.string()),
  image: J.ref('Image'),
  body: J.string()

}).required('title', 'author', 'body');
