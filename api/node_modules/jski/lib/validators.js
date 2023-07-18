
var primitives = require('./primitives.js');
var ArrayValidator = require('./array.js');
var ObjectValidator = require('./object.js');
var EnumValidator = require('./enum.js');
var ofs = require('./ofs.js');
var RefValidator = require('./ref.js');

module.exports = {

  'boolean': primitives.BooleanValidator,
  number: primitives.NumberValidator,
  integer: primitives.IntegerValidator,
  string: primitives.StringValidator,
  any: primitives.AnyValidator,
  null: primitives.NullValidator,
  array: ArrayValidator,
  object: ObjectValidator,
  'enum': EnumValidator,
  allOf: ofs.AllOfValidator,
  anyOf: ofs.AnyOfValidator,
  oneOf: ofs.OneOfValidator,
  ref: RefValidator

};