var Validator = require('./validator.js');
var Constraint = require('./constraints.js').Constraint;
var VarArgsConstraint = require('./constraints.js').VarArgsConstraint;
var common = require('./common.js');
var serialize = require('./serialize.js');

//
// Array Validator
//

var ArrayValidator = module.exports = function(context, items) {

  Validator.call(this, context, 'array');

  this.addOption('additionalItems', true);

  this.addConstraint(new Constraint(
    'maxItems',
    function(value, m, options, path) {
      return value.length <= m ? [] : [
        this.makeError('Number of items is larger than maximum: ' + m, 'maxItems', path)
      ];
    }
  ));

  this.addConstraint(new Constraint(
    'minItems',
    function(value, m, options, path) {
      return value.length >= m ? [] : [
        this.makeError('Number of items is less than minimum: ' + m, 'minItems', path)
      ];
    }
  ));

  this.addConstraint(new Constraint(
    'uniqueItems',
    function(value, u, options, path) {
      if (!u) return [];

      var errors = [];
      var cache = {};

      for (var i = 0; i < value.length; ++i) {
        var str = JSON.stringify(value[i]);
        if (cache[str]) {
          this.addError(errors, 'Array items are not unique', 'uniqueItems', path);
          break;
        }
        cache[str] = true;
      };
      return errors;
    }
  ));

  this.addConstraint(new VarArgsConstraint(
    'items',
    function(values, items, options, path) {

      var errors = [];
      var self = this;

      if (items.length > 1) {
        // array tuple

        values.forEach(function(value, i) {
          if (i < items.length) {
            self.addErrors(errors, items[i].validate(value, options, path + '/' + i));
          }
          else if (!self.additionalItems()) {
            self.addError(errors, 'Array index outside tuple length: ' + i, 'additionalItems', path + '/' + i);
          }
        });
      }
      else if (items.length === 1 && !this.additionalItems()) {
        // array

        values.forEach(function(value, i) {
          self.addErrors(errors, items[0].validate(value, options, path + '/' + i));
        });
      }

      return errors;
    },

    function(items) {
      if (items.length > 1) {
        // tuple
        return items.map(function(item) {
          return item.toJSON();
        });
      }
      else if (items.length === 1) {
        return items[0].toJSON();
      }
      else return 'null';
    },

    function(schema) {
      if (common.isArray(schema)) {
        // tuple
        return schema.map(function(item) {
          return serialize.fromJSON(item);
        });
      }
      else {
        return [serialize.fromJSON(schema)];
      }
    }
  ));

  this.addCheck(function(values, options, path) {
    return common.isArray(values) ? [] : [
      this.makeError('Value is not a array', 'array', path)
    ];
  });

  // set items constraint
  if (items && common.isArray(items) && items.length) {
    this.items.apply(this, items);
  }
};

common.extend(ArrayValidator.prototype, Validator.prototype);
