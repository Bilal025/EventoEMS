
module.exports = function(context) {
  if (context) {
    context.test = true;
  }
  return {
    type: 'object'
  };
};