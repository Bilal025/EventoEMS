var common = require('./common.js');

//
// Constraint
//

function Constraint(name, validate, toJSON, fromJSON) {

  this.name = name;
  this.enabled = false;

  this._value = null;
  this._validator = null;

  this._validate = validate;
  this._toJSON = toJSON;
  this._fromJSON = fromJSON;
};


Constraint.prototype.decorate = function(validator) {

  var self = this;

  this._validator = validator;

  // add a setter for the contraint on the validator
  validator[this.name] = function(value) {
    self._value = value;
    self.enabled = true;
    return validator;
  };
};


Constraint.prototype.validate = function(value, options, path) {

  path = path || '';
  if (this._validate) {
    return this._validate.call(this._validator, value, this._value, options, path);
  }
  return true;
};


Constraint.prototype.toJSON = function() {

  return this._toJSON ?
    this._toJSON.call(this._validator, this._value) :
    this._value;
};


Constraint.prototype.fromJSON = function(value) {

  this._value = this._fromJSON ? this._fromJSON.call(this._validator, value) : value;
  this.enabled = true;
};


//
// Variable argument/values constraint
//

function VarArgsConstraint(name, values, validate, toJSON, fromJSON) {

  Constraint.call(this, name, values, validate, toJSON, fromJSON);
};

common.extend(VarArgsConstraint.prototype, Constraint.prototype);


VarArgsConstraint.prototype.decorate = function(validator) {

  var self = this;

  this._validator = validator;

  validator[this.name] = function(varargs) {
    self._value = common.cloneArgs(arguments);
    self.enabled = true;
    return validator;
  };
};


//
// exports
//

module.exports = {
  Constraint: Constraint,
  VarArgsConstraint: VarArgsConstraint
};