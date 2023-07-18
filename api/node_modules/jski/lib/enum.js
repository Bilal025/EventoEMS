var Validator = require('./validator.js');
var Constraint = require('./constraints.js').Constraint;
var common = require('./common.js');

//
// Enum Validator
//

var EnumValidator = module.exports = function(context, items) {

  this.items = items || [];
  Validator.call(this, context, 'enum');

  this.addCheck(function(value, options, path) {
    var errors = [];
    var valid = false;

    this.items.forEach(function(item) {
      if (!valid) {
        if (common.isObject(item) || common.isArray(item)) {
          valid = JSON.stringify(item) === JSON.stringify(value);
        }
        else {
          valid = item === value;
        }
      }
    });

    if (!valid) {
      this.addError(errors, 'Not a valid enumeration item: ' + value, 'enum', path);
    }
    return errors;
  });
};


common.extend(EnumValidator.prototype, Validator.prototype);


EnumValidator.prototype.toJSON = function() {
  return Validator.prototype.toJSON.call(this, { 'enum': this.items });
};


EnumValidator.prototype.fromJSON = function(schema) {
  this.items = schema.enum;
  return Validator.prototype.fromJSON.call(this, schema);
};
