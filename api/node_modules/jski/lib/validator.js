var serialize = require('./serialize.js');
var common = require('./common.js');


//
// Validator
//

var Validator = module.exports = function(context, type) {

  this.type = type;
  this.context = context;
  this._options = {};
  this._constraints = [];
  this._checks = [];
  this._customAttributes = [];

  // meta keywords
  this.addOption('title', '');
  this.addOption('description', '');
  this.addOption('default');
};


Validator.prototype.__jski__ = true;


Validator.prototype.toJSON = function(schema) {

  schema = schema || { type: this.type };
  var self = this;

  Object.keys(this._options).forEach(function(key) {
    if (self._options[key].enabled) {
      schema[key] = self._options[key].value;
    }
  });

  this._constraints.forEach(function(constraint) {
    if (constraint.enabled) {
      schema[constraint.name] = constraint.toJSON();
    }
  });

  Object.keys(this._customAttributes).forEach(function(key) {
    schema[key] = self._customAttributes[key];
  });

  return schema;
};


Validator.prototype.clone = function(context) {

  context = context || this.context;
  return serialize.fromJSON(this.toJSON(), context);
};


Validator.prototype.fromJSON = function(schema) {

  var self = this;

  Object.keys(schema).forEach(function(key) {

    if (common.isKeyword(key)) return;

    if (self._options.hasOwnProperty(key)) {
      self._options[key] = {
        enabled: true,
        value: schema[key]
      };
    }
    else {
      var isConstraint = false;

      self._constraints.forEach(function(constraint) {
        if (constraint.name === key) {
          constraint.fromJSON(schema[key]);
          isConstraint = true;
        }
      });

      if (!isConstraint) {
        self._customAttributes[key] = schema[key];
      }
    }
  });

  return this;
};


Validator.prototype.addOption = function(name, defaultValue) {

  this._options[name] = {
    enabled: false,
    value: defaultValue
  };

  this[name] = function(value) {

    // get value when not passed
    if (common.isUndefined(value)) {
      return this._options[name].value;
    }

    // set value
    var o = this._options[name];
    o.enabled = true;
    o.value = value;

    return this;
  };
};


Validator.prototype.addConstraint = function(constraint) {

  constraint.decorate(this);
  this._constraints.push(constraint);
};


Validator.prototype.addCheck = function(check) {

  this._checks.push(check);
};


Validator.prototype.definitions = function(defs) {

  if (common.isUndefined(defs)) {
    return this._definitions;
  }
  this._definitions = defs;
  return this;
}


Validator.prototype.custom = function(name, value) {

  if (typeof value === 'undefined') {
    return this._customAttributes[name];
  }
  this._customAttributes[name] = value;
  return this;
};


Validator.prototype.validate = function(value, options, path) {

  // validate jski validators
  if (common.isObject(value) && value.__jski__) {
    value = value.toJSON();
  }

  path = path || '';
  options = options || {};

  var errors = [];
  var self = this;

  // pass on local definitions
  var defs = this.definitions();
  if (defs) {
    options.definitions = options.definitions || {};
    common.extend(options.definitions, defs);
  }

  this._constraints.forEach(function(constraint) {
    if (constraint.enabled) {
      self.addErrors(errors, constraint.validate(value, options, path));
    }
  });

  this._checks.forEach(function(check) {
    self.addErrors(errors, check.call(self, value, options, path));
  });

  return errors;
};


Validator.prototype.makeError = function(message, code, path) {

  return { message: message, code: code, path: path };
};


Validator.prototype.addError = function(errors, message, code, path) {

  errors.push(this.makeError.apply(this, common.cloneArgs(arguments, 1)));
  return errors;
};


Validator.prototype.addErrors = function(errors, newErrors) {

  newErrors.forEach(function(err) {
    errors.push(err);
  });
  return errors;
};
