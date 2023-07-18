jski - json schema validator
============================

JSON Schema support
-------------------
jski validates a subset of json schema v4. Following features are missing or restricted:

* no union types
* array: additionalItems can only be true or false, not a schema
* object: additionalProperties can only be true or false
* object: no patternProperties
* object: no dependencies
* $ref: definitions are solely looked up by name in `options.definitions` or `jski.object({...}).defintions({...})`
* not: not supported


Installation
------------

`npm install jski`


Usage
-----

`var J = require('jski')();`


Examples
--------

### Create schema using method chaining

```javascript

var J = require('jski')();

var validator = J.object({
  foo: J.number(),
  bar: J.string().maxLength(255)
});

var errs = validator.validate({ foo: 11, bar: 'hello' });

```

### Create validator from json

```javascript

var J = require('jski')();

var js = {
  foo: { type: 'number' },
  bar: { type: 'string', maxLength: 255 }
};

var validator = J.createValidator(js);

var errs = validator.validate({ foo: true, bar: 'hello' });

```

### Get schema in json form

```javascript

var J = require('jski')();

var json = J.object({ foo: J.string() }).toJSON();

```

API
---

### Building schemas with method chaining

#### Types

* `J.boolean()`
* `J.number().minimum(1).maximum(10).multipleOf()`
* `J.integer()` - Same as number
* `J.string().minLength(1).maxLength(10).pattern('[0-9]*').format('email')`
* `J.array(J.number()).minItems(1).maxItems(10).uniqueItems(true).additionalItems(false)`
* `J.array(J.number(), J.string(), J.boolean())`
* `J.object({ foo: J.number() }).minProperties(1).maxProperties(10).required('foo', 'bar').additionalProperties(false)`
* `J.enum(1, 2, 3)`
* `J.any()`
* `J.null()`
* `J.allOf(schema1, schema2, schema3)`
* `J.anyOf(schema1, schema2, schema3)`
* `J.oneOf(schema1, schema2, schema3)`

#### Common methods available to all types

* `J.number().title('foo').description('bar').default(11)`

### Validation

`validate(value, options)` returns an error array. When the value is valid, the array is empty.

* `var errors = J.number().maximum(127).validate(128)`

### Definitions

Add Defintions:

* by method: `J.object({...}).definitions({...})`
* by options: `var errors = J.object({...}).validate({...}, { definitions: {...} })`

### Serializing schemas from/to JSON

* `J.createValidator(Schema JSON)`
* `J.object({ foo: j.string() }).toJSON()`

### Create a default value for a schema

* `J.createValue(J.number())`
* `J.createValue({ type: 'number' })`

### Options

`J.object().validate(value, { definitions: defs, omitRefs: true })`

* `definitions` - Dict where $refs are lookuped by name
* `omitRefs` - Do not validate $refs

### Add mixins for validators

Simple way to reuse definitions without using an actual $ref

```javascript
var validator = J
  .mixin('foo', J.object({ bar: J.string() }))
  .mixin('bar', J.object({ baz: J.number() }))
  .object({
    un: J.foo(),
    dos: J.bar()
  });
```

### Validator context

```javascript
var J = require('jski)();
var v1 = J.object({ foo: J.string() });
assert(v1.context === J);
```

### Errors

Error messages look like:

`{ message: "Value is too long", code: "maxLength", path: "/foo/bar/0/baz" }`
