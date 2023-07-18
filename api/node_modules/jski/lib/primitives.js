var Validator = require('./validator.js');
var Constraint = require('./constraints.js').Constraint;
var common = require('./common.js');


//
// Boolean Validator
//

function BooleanValidator(context) {

  Validator.call(this, context, 'boolean');

  this.addCheck(function(value, options, path) {
    return common.isBoolean(value) ? [] : [
      this.makeError('Value is not a boolean', 'boolean', path)
    ];
  });
};

common.extend(BooleanValidator.prototype, Validator.prototype);


//
// Number Validator
//

function NumberValidator(context) {

  Validator.call(this, context, 'number');

  this.addConstraint(new Constraint(
    'multipleOf',
    function(value, n, options, path) {
      return value % n === 0 ? [] : [
        this.makeError('Value is not a multiple of: ' + n, 'multipleOf', path)
      ];
    }
  ));

  this.addConstraint(new Constraint(
    'maximum',
    function(value, n, options, path) {
      return value <= n ? [] : [
        this.makeError('Value is greater than the maximum: ' + n, 'maximum', path)
      ];
    }
  ));

  this.addConstraint(new Constraint(
    'minimum',
    function(value, n, options, path) {
      return value >= n ? [] : [
        this.makeError('Value is less than minimum: ' + n, 'minimum', path)
      ];
    }
  ));

  this.addCheck(function(value, options, path) {
    return common.isNumber(value) ? [] : [
      this.makeError('Value is not a number', 'number', path)
    ];
  });
};

common.extend(NumberValidator.prototype, Validator.prototype);


//
// Integer Validator
//

function IntegerValidator(context) {

  NumberValidator.call(this, context, arguments);
  this.type = 'integer';

  this.addCheck(function(value, options, path) {
    return Math.floor(value) === value ? [] : [
      this.makeError('Value is not an integer', 'integer', path)
    ];
  });
};


common.extend(IntegerValidator.prototype, NumberValidator.prototype);


//
// StringValidator
//

function StringValidator(context) {

  Validator.call(this, context, 'string');

  this.addConstraint(new Constraint(
    'maxLength',
    function(value, n, options, path) {
      return value.length <= n ? [] : [
        this.makeError('Value is less than minimum: ' + n, 'maxLength', path)
      ];
    }
  ));

  this.addConstraint(new Constraint(
    'minLength',
    function(value, n, options, path) {
      return value.length >= n ? [] : [
        this.makeError('Value is less than minimum: ' + n, 'minLength', path)
      ];
    }
  ));

  this.addConstraint(new Constraint(
    'pattern',
    function(value, p, options, path) {
      return new RegExp(p).test(value) ? [] : [
        this.makeError('Value does not match pattern: ' + p, 'pattern', path)
      ];
    }
  ));

  this.addConstraint(new Constraint(
    'format',
    function(value, f, options, path) {
      if (!common.formats[f]) {
        return [this.makeError('Unkown format: ' + f, 'format', path)];
      }
      if (!common.formats[f].test(value)) {
        return [this.makeError('Value does not match format: ' + f, 'format', path)];
      }
      return [];
    }
  ));

  this.addCheck(function(value, options, path) {
    return common.isString(value) ? [] : [
      this.makeError('Value is not a string', 'string', path)
    ];
  });
};

common.extend(StringValidator.prototype, Validator.prototype);


//
// Any Validator
//

function AnyValidator(context) {

  Validator.call(this, context, 'any');
};

common.extend(AnyValidator.prototype, Validator.prototype);


//
// Null Validator
//

function NullValidator(context) {

  Validator.call(this, context, 'null');

  this.addCheck(function(value, options, path) {
    return common.isNull(value) ? [] : [
      this.makeError('Value is not null', 'null', path)
    ];
  });
};

common.extend(NullValidator.prototype, Validator.prototype);


//
// exports
//

module.exports = {
  BooleanValidator: BooleanValidator,
  NumberValidator: NumberValidator,
  IntegerValidator: IntegerValidator,
  StringValidator: StringValidator,
  AnyValidator: AnyValidator,
  NullValidator: NullValidator
};
