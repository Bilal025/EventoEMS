var common = require('./common.js');
var vs = require('./validators');


//
// Create Validator from schema
//
exports.fromJSON = function fromJSON(schema, context) {

  var validator;

  if (schema.type || schema.properties || schema.items) {

    var type = schema.type;
    // infer 'array' and 'object' type
    if (schema.properties) type = 'object';
    if (schema.items) type = 'array';

    validator = new ({
      'boolean': vs.boolean,
      'number':  vs.number,
      'integer': vs.integer,
      'string':  vs.string,
      'any':     vs.any,
      'null':    vs.null,
      'array':   vs.array,
      'object':  vs.object
    })[type](context);
  }
  else if (schema.enum) {
    validator = new vs.enum(context);
  }
  else if (schema.allOf) {
    validator = new vs.allOf(context);
  }
  else if (schema.anyOf) {
    validator = new vs.anyOf(context);
  }
  else if (schema.oneOf) {
    validator = new vs.oneOf(context);
  }
  else if (schema.$ref) {
    validator = new vs.ref(context);
  }

  if (!validator) {
    var err = new Error('Unkown schema');
    err.schema = schema;
    throw err;
  }

  return validator.fromJSON(schema);
};


//
// create a default value from schema
//
module.exports.createValue = function createValue(schema) {

  // convert jski object to schema
  if (common.isObject(schema) && schema.__jski__) {
    schema = schema.toJSON();
  }

  var hasDefaultValue = schema.hasOwnProperty('default');
  var type = schema.type;

  if (schema.enum) {
    return hasDefaultValue ? schema.default : schema.enum[0];
  }
  if (schema.$ref) {
    return hasDefaultValue ? schema.default : {};
  }
  // infer object and array
  if (!schema.type) {
    if (schema.properties) type = 'object';
    if (schema.items) type = 'array';
  }

  if (!type) throw new Error('Cannot create default value for schema without type');

  switch(type) {
  case 'boolean': return hasDefaultValue ? schema.default : true;
  case 'integer': return hasDefaultValue ? schema.default : 0;
  case 'number': return hasDefaultValue ? schema.default : 0;
  case 'string': return hasDefaultValue ? schema.default : '';
  case 'object': {
    if (hasDefaultValue) return schema.default;
    var obj = {};
    if (typeof schema.properties === 'object') {
      Object.keys(schema.properties).forEach(function(key) {
        obj[key] = createValue(schema.properties[key]);
      });
    }
    return obj;
  }
  case 'array': return hasDefaultValue ? schema.default : [];
  default: throw new Error('Cannot create default value for unknown type: ' + type);
  }
}
