/*global describe it*/

var assert = require('assert');
var util = require('util');

var J = require('./index.js')();


describe('jski', function() {

  describe('5.1. number and integer', function() {

    it('should create the schema', function() {
      assert(J.number().type === 'number');
    });

    it('should validate value', function() {
      assert(J.number().validate(10).length === 0);
    });

    it('should not validate invalid value', function() {
      assert(J.number().validate(true).length === 1);
    });

    it('should not validate float value as integer', function() {
      assert(J.integer().validate(3.3).length === 1);
    });


    describe('5.1.1. multipleOf', function() {

      it('should be a multiple of', function() {
        assert(J.number().multipleOf(3).validate(9).length === 0);
      });

      it('should not validate when not a multiple of', function() {
        assert(J.number().multipleOf(3).validate(5).length === 1);
      });
    });


    describe('5.1.2. maximum', function() {

      it('should validate when equal or less', function() {
        assert(J.number().maximum(3).validate(3).length === 0);
        assert(J.number().maximum(3).validate(2).length === 0);
      });

      it('should not validate when greater', function() {
        assert(J.number().maximum(3).validate(4).length === 1);
      });
    });


    describe('5.1.3. minimum', function() {

      it('should validate when equal or greater', function() {
        assert(J.number().minimum(1).validate(1).length === 0);
        assert(J.number().minimum(1).validate(2).length === 0);
      });

      it('should not validate when greater', function() {
        assert(J.number().minimum(1).validate(0).length === 1);
      });
    });
  });


  describe('5.2. strings', function() {

    var schema;

    it('should create the schema', function() {
      assert(J.string().type === 'string');
    });

    it('should validate a value', function() {
      assert(J.string().validate('foo').length === 0);
    });

    it('should not validate invalid value', function() {
      assert(J.string().validate(11).length === 1);
    });


    describe('5.2.1 maxLength', function() {

      it('should not exceed max length', function() {
        assert(J.string().maxLength(2).validate('fo').length === 0);
        assert(J.string().maxLength(2).validate('f').length === 0);
      });

      it('should not validate when exceeding max length', function() {
        assert(J.string().maxLength(2).validate('foo').length === 1);
      });
    });


    describe('5.2.2. minLength', function() {

      it('should be least min characters long', function() {
        assert(J.string().minLength(3).validate('foo').length === 0);
        assert(J.string().minLength(3).validate('fooo').length === 0);
      });

      it('should not validate when not long enough', function() {
        assert(J.string().minLength(3).validate('fo').length === 1);
      });
    });


    describe('5.2.3. pattern', function() {

      it('should match the pattern', function() {
        assert(J.string().pattern('^hello$').validate('hello').length === 0);
      });

      it('should not validate when not matching the pattern', function() {
        assert(J.string().pattern('^hello$').validate('hello world').length === 1);
      });
    });
  });


  describe('5.3. arrays', function() {

    it('should create the schema', function() {
      assert(J.array().type === 'array');
    });

    it('should validate anything whithout items specified', function() {
      assert(J.array().validate([1, '1', true]).length === 0);
    });

    describe('5.3.1. additionalItems and items', function() {

      it('should validate the items', function() {
        assert(J.array(J.number()).validate([1, 2, 3]).length === 0);
      });

      it('should not validate when value not of type array', function() {
        assert(J.array(J.number()).validate(123).length === 1);
      });

      it('should validate when item has wrong type', function() {
        assert(J.array(J.number()).validate([true]).length === 0);
      });

      it('should not validate when item has wrong type and additional not allowed', function() {
        assert(J.array(J.number()).additionalItems(false).validate([true, '']).length > 0);
      });

      it('should validate a tuple', function() {
        assert(J.array(
          J.integer(), J.string(), J.boolean()
        ).validate([1, '1', true]).length === 0);
      });

      it('should not validate a invalid tuple', function() {
        assert(J.array(
          J.integer(), J.string(), J.boolean()
        ).validate([1, '1', 1]).length === 1);
      });
    });


    describe('5.3.2. maxItems', function() {

      it('should not have too many items', function() {
        assert(J.array().maxItems(3).validate([1, 2]).length === 0);
        assert(J.array().maxItems(3).validate([1, 2, 3]).length === 0);
      });

      it('should not validate when has too many items', function() {
        assert(J.array().maxItems(2).validate([1, 2, 3]).length === 1);
      });
    });


    describe('5.3.3. minItems', function() {

      it('should have least min items', function() {
        assert(J.array().minItems(2).validate([1, 2, 3]).length === 0);
        assert(J.array().minItems(2).validate([1, 2]).length === 0);
      });

      it('should not validate when not has enough items', function() {
        assert(J.array().minItems(2).validate([1]).length === 1);
      });
    });


    describe('5.3.4. uniqueItems', function() {

      it('should be unique', function() {
        assert(J.array().uniqueItems(true).validate([1, 2, 3]).length === 0);
      });

      it('should not validate when not unique', function() {
        assert(J.array().uniqueItems(true).validate([1, 2, 2]).length === 1);
      });
    });
  });


  describe('5.4. objects', function() {

    var schema;

    it ('should create the schema', function() {
      schema = J.object({
        foo: J.boolean(),
        bar: J.string(),
        baz: J.object({
          ban: J.number()
        })
      });
      assert(schema.type === 'object');
    });

    it('should validate value', function() {
      assert(schema.validate({ foo: true, bar: 'hello', baz: { ban: 42 } }).length === 0);
    });

    it('should not validate invalid value', function() {
      assert(schema.validate({ foo: true, bar: 11, baz: { ban: 'boo' } }).length === 2);
    });

    describe('5.4.1. maxProperties', function() {

      it('should not have too many properties', function() {
        assert(J.object().maxProperties(2).validate({a: 1, b: 2}).length === 0);
        assert(J.object().maxProperties(2).validate({a: 1}).length === 0);
      });

      it('should not validate when has too many properties', function() {
        assert(J.object().maxProperties(1).validate({a: 1, b: 2}).length === 1);
      });
    });


    describe('5.4.2. minProperties', function() {

      it('should have at least a minimum of properties', function() {
        assert(J.object().minProperties(1).validate({a: 1, b: 2}).length === 0);
        assert(J.object().minProperties(2).validate({a: 1, b: 2}).length === 0);
      });

      it('should not validate when has not enough properties', function() {
        assert(J.object().minProperties(3).validate({a: 1, b: 2}).length === 1);
      });
    });


    describe('5.4.3. required', function() {

      var schema = J.object({
        foo: J.string(),
        bar: J.number(),
        baz: J.boolean()
      }).required('foo', 'bar');

      it('should validate when required property is present', function() {
        assert(schema.validate({foo: '', bar: 42}).length === 0);
      });

      it('should validate when non required property is present', function() {
        assert(schema.validate({foo: '', bar: 42, baz: true}).length === 0);
      });

      it('should not validate when required property is missing', function() {
        assert(schema.validate({bar: 42}).length === 1);
      });
    });


    describe('5.4.4.', function() {

      describe('properties', function() {

        var schema = J.object({
          foo: J.number(),
          bar: J.boolean()
        });

        it('should validate', function() {
          assert(schema.validate({foo: 42, bar: false}).length === 0);
        });

        it('should validate with additional properties', function() {
          assert(schema.validate({foo: 42, bar: false, baz: ''}).length === 0);
        });

        it('should not validate when properties are of the wring type', function() {
          assert(schema.validate({foo: 42, bar: ''}).length === 1);
        });

        it('should not validate when no additional properties are allowed', function() {
          assert(schema
                 .additionalProperties(false)
                 .validate({foo: 42, bar: false, baz: ''}).length === 1);
        });
      });
    });
  });


  describe('5.5. keywords for any instance', function() {

    describe('5.5.1. enum', function() {

      it('should validate a primitive enum value', function() {
        assert(J.enum(true, false).validate(false).length === 0);
        assert(J.enum(1, 2, 3).validate(2).length === 0);
        assert(J.enum('one', 'two').validate('two').length === 0);
      });

      it('should validate a object enum value', function() {
        assert(J.enum({foo: 42}, {bar: 'baz'}).validate({foo: 42}).length === 0);
        assert(J.enum([1, 2], ['one', 'two']).validate(['one', 'two']).length === 0);
      });

      it('should not validate a non existant enum value', function() {
        assert(J.enum(true).validate(false).length === 1);
        assert(J.enum(1, 2, 3).validate(4).length === 1);
        assert(J.enum('one', 'two').validate('three').length === 1);
        assert(J.enum({foo: 42}, {bar: 'baz'}).validate({foo: '42'}).length === 1);
        assert(J.enum([1, 2], ['one', 'two']).validate(['one']).length === 1);
      });
    });


    describe('5.5.2. type', function() {

      it('should validate standard types', function() {
        assert(J.string().validate('').length === 0);
        assert(J.number().validate(11.1).length === 0);
        assert(J.integer().validate(12).length === 0);
        assert(J.boolean().validate(false).length === 0);
        assert(J.object().validate({}).length === 0);
        assert(J.array().validate([]).length === 0);
        assert(J.null().validate(null).length === 0);
        assert(J.any().validate('foo').length === 0);
      });

      it('should not validate when value is of wrong type', function() {
        assert(J.string().validate(false).length === 1);
        assert(J.number().validate('').length === 1);
        assert(J.integer().validate(12.1).length === 1);
        assert(J.boolean().validate(11).length === 1);
        assert(J.object().validate([]).length === 1);
        assert(J.array().validate({}).length === 1);
        assert(J.null().validate({}).length === 1);
      });
    });
  });


  describe('5.5.3. allOf', function() {

    var schema = J.allOf(
      J.object({ foo: J.number() }),
      J.object({ bar: J.string() })
    );

    it('should conform to all schemas', function() {
      assert(schema.validate({ foo: 42, bar: '' }).length === 0);
    });

    it('should not validate when not conforming to all schemas', function() {
      assert(schema.validate({ foo: 42, bar: true }).length === 1);
    });
  });


  describe('5.5.3. anyOf', function() {

    var schema = J.anyOf(
      J.object({ foo: J.number() }),
      J.object({ foo: J.string() })
    );

    it('should be valid', function() {
      assert(schema.validate({ foo: 42 }).length === 0);
      assert(schema.validate({ foo: 'hello' }).length === 0);
    });

    it('should not be valid', function() {
      assert(schema.validate({ foo: true }).length === 1);
    });
  });


  describe('5.5.3. oneOf', function() {

    var schema = J.oneOf(
      J.object({ foo: J.string(), bar: J.boolean() }),
      J.object({ foo: J.string(), bar: J.number() })
    );

    it('should conform to only one schema', function() {
      assert(schema.validate({foo: '', bar: true }).length === 0);
    });

    it('should not validate when more than one schema match', function() {
      assert(schema.validate({foo: ''}).length === 1);
    });
  });


  describe('7.3. format', function() {

    it('should validate formats', function() {
      assert(J.string().format('email').validate('tim.tim@tom.co.hk').length === 0);
      assert(J.string().format('ip-address').validate('127.0.0.1').length === 0);
      assert(J.string().format('ipv6').validate('2001:0db8:85a3:08d3:1319:8a2e:0370:7344').length === 0);
      assert(J.string().format('date-time').validate('2011-03-12T08:04:10Z').length === 0);
      assert(J.string().format('date').validate('2011-21-01').length === 0);
      assert(J.string().format('time').validate('12:33:11').length === 0);
      assert(J.string().format('host-name').validate('canada.org').length === 0);
      assert(J.string().format('color').validate('#ff0000').length === 0);
      assert(J.string().format('utc-millisec').validate('123').length === 0);
      assert(J.string().format('regex').validate('a').length === 0);
    });

    it('should validate non standard formats', function() {
      assert(J.string().format('url').validate('https://localhost.com/bar/baz').length === 0);
      assert(J.string().format('slug').validate('9-hello-world-whats-up').length === 0);
    });

    it('should not validate invalid string formats', function() {
      assert(J.string().format('email').validate('tim.tim@tom@co.hk').length === 1);
      assert(J.string().format('ip-address').validate('127.0.0.1.1').length === 1);
      assert(J.string().format('ipv6').validate('2001:0db8:85a3:08d3:1319:8a2e:0370').length === 1);
      assert(J.string().format('date-time').validate('2011-03-12TT08:04:10Z').length === 1);
      assert(J.string().format('date').validate('2011-211-01').length === 1);
      assert(J.string().format('time').validate('122:33:11').length === 1);
      assert(J.string().format('host-name').validate('canada.org/foo/bar').length === 1);
      assert(J.string().format('color').validate('#ff00000').length === 1);
      assert(J.string().format('utc-millisec').validate('123m3').length === 1);
      assert(J.string().format('regex').validate('\\').length === 1);
    });

    it('should not validate non standard invalid format', function() {
      assert(J.string().format('url').validate('http:/localhost/asd').length === 1);
      assert(J.string().format('slug').validate('-9hello-world-whats-up-').length === 1);
      assert(J.string().format('slug').validate('hello-World-whats-up').length === 1);
    });
  });


  describe('6.1 title and description', function() {

    it('should set title', function() {
      assert(J.object().title('foo').toJSON().title === 'foo');
    });

    it('should set description', function() {
      assert(J.object().description('foo').toJSON().description === 'foo');
    });
  });


  describe('6.2 default', function() {

    it('should set default', function() {
      assert(J.object().default(123).toJSON().default === 123);
    });
  });


  describe('ref definitions', function() {

    var schema = J.ref('foo');
    var definitions = {
      foo: J.number()
    };

    it('should validate against the referenced schema', function() {
      assert(schema.validate(11, { definitions: definitions }).length === 0);
    });

    it('should not validate against the missing definition', function() {
      assert(schema.validate(11).length === 1);
    });

    it('should not validate when not matching referenced schema', function() {
      assert(schema.validate(true, { definitions: definitions }).length === 1);
    });

    it('should validate when ommiting refs', function() {
      assert(schema.validate(true, { definitions: definitions, omitRefs: true }).length === 0);
    });
  });


  describe('serialize', function() {

    var schemas = {

      boolean: [
        { schema: { type: 'boolean' },
          val: J.boolean() }
      ],
      number: [
        { schema: { type: 'number' },
          val: J.number() },
        { schema: { type: 'number', minimum: 1, maximum: 10, multipleOf: 2 },
          val: J.number().minimum(1).maximum(10).multipleOf(2) }
      ],
      integer: [
        { schema: { type: 'integer' },
          val: J.integer() }
      ],
      string: [
        { schema: { type: 'string' },
          val: J.string() },
        { schema: { type: 'string', minLength: 1, maxLength: 10, pattern: '.*', format: 'email' },
          val: J.string().minLength(1).maxLength(10).pattern('.*').format('email') }
      ],
      array: [
        { schema: { type: 'array' },
          val: J.array() },
        { schema: { type: 'array', additionalItems: false, minItems: 1, maxItems: 10,
                    uniqueItems: true, items: { type: 'number' }},
          val: J.array(J.number()).minItems(1).maxItems(10).uniqueItems(true).additionalItems(false) },
        { schema: { type: 'array', items: [{ type: 'number'}, {type: 'string' }] },
          val: J.array(J.number(), J.string()) }
      ],
      object: [
        { schema: { type: 'object' },
          val: J.object() },
        { schema: { type: 'object', properties: { foo: { type: 'number' } },
                    minProperties: 1, maxProperties: 10, required: ['foo'], additionalProperties: false},
          val: J.object({ foo: J.number() }).minProperties(1).maxProperties(10)
          .required('foo').additionalProperties(false) }
      ],
      'enum': [
        { schema: { 'enum': [1, 2, 3] },
          val: J.enum(1, 2, 3) },
        { schema: { 'enum': [1, 2, 3], foo: 'bar'},
          val: J.enum(1, 2, 3).custom('foo', 'bar')}
      ],
      'null': [
        { schema: { type: 'null' },
          val: J.null() }
      ],
      any: [
        { schema: { type: 'any' },
          val: J.any() }
      ],
      allOf: [
        { schema: { allOf: [{ type: 'number'}, { type: 'string' }]},
          val: J.allOf(J.number(), J.string()) },
        { schema: { allOf: [{ type: 'number'}, { type: 'string' }], foo: 'bar' },
          val: J.allOf(J.number(), J.string()).custom('foo', 'bar') }
      ],
      anyOf: [
        { schema: { anyOf: [{ type: 'number'}, { type: 'string' }]},
          val: J.anyOf(J.number(), J.string()) }
      ],
      oneOf: [
        { schema: { oneOf: [{ type: 'number'}, { type: 'string' }]},
          val: J.oneOf(J.number(), J.string()) }
      ],
      ref: [
        { schema: { $ref: 'foo' },
          val: J.ref('foo') },
        { schema: { $ref: 'foo', foo: 'bar' },
          val: J.ref('foo').custom('foo', 'bar') }
      ]
    };

    describe('fromJSON', function() {
      Object.keys(schemas).forEach(function(key) {
        it('should create ' + key, function() {
          schemas[key].forEach(function(config) {
            assert.deepEqual(config.schema,
                             J.createValidator(config.schema).toJSON());
          });
        });
      });
    });

    describe('toJSON', function() {
      Object.keys(schemas).forEach(function(key) {
        it('should create ' + key, function() {
          schemas[key].forEach(function(config) {
            assert.deepEqual(config.schema, config.val.toJSON());
          });
        });
      });
    });
  });


  describe('custom attributes', function() {

    it('should add custom attributes', function() {
      assert.deepEqual(J.object().custom('foo', 11).toJSON(), { type: 'object', foo: 11 });
    });

    it('should get custom attribute', function() {
      var v = J.object().custom('foo', 11);
      assert(v.custom('foo') === 11);
    });

    it('should keep custom attributes from json schema', function() {
      assert.deepEqual(J.createValidator({ type: 'object', foo: 11 }).toJSON(),
                       { type: 'object', foo: 11 });
    });
  });


  describe('create value from schema', function() {

    var types = [
      { name: 'boolean',
        schema: { type: 'boolean' },
        value: true },
      { name: 'boolean default',
        schema: { type: 'boolean', default: false },
        value: false },
      { name: 'number',
        schema: { type: 'number' },
        value: 0 },
      { name: 'number default',
        schema: { type: 'number', default: 1.1 },
        value: 1.1 },
      { name: 'integer',
        schema: { type: 'integer' },
        value: 0 },
      { name: 'string',
        schema: { type: 'string' },
        value: '' },
      { name: 'string default',
        schema: { type: 'string', default: 'hello' },
        value: 'hello' },
      { name: 'enum',
        schema: { 'enum': [1, 2] },
        value: 1 },
      { name: 'enum default',
        schema: { 'enum': [1, 2], default: 2 },
        value: 2 },
      { name: 'ref',
        schema: { $ref: 'Foo' },
        value: {} },
      { name: 'ref default',
        schema: { $ref: 'Foo', default: { id: 'bar'} },
        value: { id: 'bar' } },
      { name: 'object',
        schema: { type: 'object' },
        value: {} },
      { name: 'object default',
        schema: { type: 'object', default: { foo: 'bar' } },
        value: { foo: 'bar'} },
      { name: 'object properties',
        schema: { type: 'object', properties: { foo: { type: 'string' } } },
        value: { foo: '' } },
      { name: 'array',
        schema: { type: 'array' },
        value: [] },
      { name: 'array default',
        schema: { type: 'array', default: [1, 2], value: [1, 2] },
        value: [1, 2] },
      { name: 'anyof',
        schema: { type: 'array', items: { anyOf: [] } },
        value: [] },
      { name: 'J schema primitive',
        schema: J.number(),
        value: 0 },
      { name: 'J schema object',
        schema: J.object({ foo: J.boolean() }),
        value: { foo: true }}
    ];

    types.forEach(function(type) {

      it('should create value for ' + type.name, function() {
        assert(JSON.stringify(J.createValue(type.schema)) === JSON.stringify(type.value));
      });
    });
  });


  describe('complex schema', function() {

    var schema = J.object({
      title: J.string(),
      tags: J.array(J.string()),
      image: J.string().format('url'),
      sections: J.array(
        J.anyOf(
          J.ref('HeaderSection'),
          J.ref('TextSection'),
          J.ref('ImageSection'),
          J.ref('VideoSection'),
          J.ref('TagSection')
        )
      ).additionalItems(false)

    }).required('title', 'image', 'sections')
      .additionalProperties(false);

    var definitions = {
      HeaderSection: J.object({
        headline: J.string(),
        subheadline: J.string()
      }),
      TextSection: J.string(),
      ImageSection: J.object({
        caption: J.string(),
        url: J.string().format('url')
      }),
      VideoSection: J.object({
        caption: J.string(),
        embedCode: J.string()
      }),
      TagSection: J.array(J.string())
    };

    var data = {
      title: 'Talk about foo',
      tags: ['a', 'b', 'c'],
      image: 'http://www.foo.com/bar.png',
      sections: [
        { headline: 'There you go', subheadline: 'Again' },
        'The text is the text is the text',
        { caption: 'balu', url: 'http://djungle.id/balu.jpg' },
        { caption: 'mogli', embedCode: 'foobarbaz' },
        ['uh', 'oh', 'ah']
      ]
    };

    it('should validate', function() {
      assert(schema.validate(data, { definitions: definitions }).length === 0);
    });

    it('should validate when added definitions', function() {
      schema.definitions(definitions);
      assert(schema.validate(data).length === 0);
    });

    it('should not validate', function() {
      data.sections.push(42);
      assert(schema.validate(data, { definitions: definitions }).length === 1);
    });
  });


  describe('errors', function() {

    it('should not have a path when toplevel is primitive', function() {
      assert(J.number().validate('123')[0].path === '');
    });

    it('should have paths to object properties', function() {
      var errs = J.object({
        foo: J.number(),
        bar: J.string()
      }).validate({
        foo: '123',
        bar: 123
      });

      assert(errs.length === 2);
      assert(errs[0].path === '/foo');
      assert(errs[1].path === '/bar');
    });

    it('should have paths to nested properties', function() {
      var errs = J.object({
        foo: J.object({ bar: J.number() })
      }).validate({
        foo: { bar: true }
      });

      assert(errs.length === 1);
      assert(errs[0].path === '/foo/bar');
    });

    it('should have paths to required properties', function() {
      var errs = J.object({
        foo: J.object({ bar: J.number() }).required('bar')
      }).validate({
        foo: {}
      });

      assert(errs.length === 1);
      assert(errs[0].path === '/foo/bar');
    });

    it('should have paths to array items', function() {
      var errs = J.array(
        J.number(),
        J.string()
      ).validate(['', 1]);

      assert(errs.length === 2);
      assert(errs[0].path === '/0');
      assert(errs[1].path === '/1');
    });

    it('should have paths to objects in arrays', function() {
      var errs = J.array(
        J.object({ foo: J.number() })
      ).additionalItems(false).validate([{ foo: '' }]);

      assert(errs.length === 1);
      assert(errs[0].path === '/0/foo');
    });
  });


  describe('validating schemas', function() {

    it('should validate another schema validator', function() {
      assert(J.object({ type: J.string() }).validate(J.number()).length === 0);
    });
  });


  describe('clone schema', function() {

    it('should clone validator', function() {

      var v = J.object({
        foo: J.string(),
        bar: J.object({ baz: J.boolean().default(false) }),
        zoo: J.string().custom('something', 11)
      }).required('foo', 'bar');

      var c = v.clone();

      assert.deepEqual(c.toJSON(), v.toJSON());
    });
  });


  describe('mixin', function() {

    it('should be addable', function() {
      var j = J.mixin('foo', J.string());
      assert(j.foo().type === 'string');
    });

    it('should keep context when used', function() {
      var j = J.mixin('foo', J.string());
      assert(j.foo().context === j);
    });
  });
});
