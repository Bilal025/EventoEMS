var Validator = require('./validator.js');
var Constraint = require('./constraints.js').Constraint;
var VarArgsConstraint = require('./constraints.js').VarArgsConstraint;
var common = require('./common.js');
var serialize = require('./serialize.js');

//
// Object Validator
//

var ObjectValidator = module.exports = function(context, args) {

  Validator.call(this, context, 'object');

  var properties = args ? args[0] : null;

  this.addOption('additionalProperties', true);

  this.addConstraint(new Constraint(
    'maxProperties',
    function(value, m, options, path) {
      return Object.keys(value).length <= m ? [] : [
        this.makeError('Number of properties is larger than maximum: ' + m, 'maxProperties', path)
      ];
    }
  ));

  this.addConstraint(new Constraint(
    'minProperties',
    function(value, m, options, path) {
      return Object.keys(value).length >= m ? [] : [
        this.makeError('Number of properties is less than minimum: ' + m, 'minProperties', path)
      ];
    }
  ));

  this.addConstraint(new VarArgsConstraint(
    'required',
    function(value, reqs, options, path) {
      var errors = [];
      var self = this;

      reqs.forEach(function(name) {
        if (!value.hasOwnProperty(name)) {
          self.addError(errors, 'Required property is missing: ' + name, 'required', path + '/' + name);
        }
      });
      return errors;
    }
  ));

  this.addConstraint(new Constraint(
    'properties',

    function(value, properties, options, path) {
      var errors = [];

      for (var n in value) {
        if (properties[n]) {
          this.addErrors(errors, properties[n].validate(value[n], options, path + '/' + n));
        }
        else if (!this.additionalProperties()) {
          this.addError(errors, 'Object has no property with name: ' + n, 'additionalProperties', path + '/' + n);
        }
      }
      return errors;
    },

    function(properties) {
      var schema = {};
      Object.keys(properties).forEach(function(key) {
        schema[key] = properties[key].toJSON();
      });
      return schema;
    },

    function(schema) {
      properties = {};
      Object.keys(schema).forEach(function(key) {
        properties[key] = serialize.fromJSON(schema[key]);
      });
      return properties;
    }
  ));

  this.addCheck(function(value, options, path) {
    return common.isObject(value) && !common.isArray(value) ? [] : [
      this.makeError('Value is not an object', 'object', path)
    ];
  });

  // shortcut to set constraint
  if (properties) this.properties(properties);
};

common.extend(ObjectValidator.prototype, Validator.prototype);
