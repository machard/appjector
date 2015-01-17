'use strict';

var assert = require('assert');
var path = require('path');
var _ = require('lodash');

var Definition = require('../index').Definition;

describe('testing Definition', function() {
  var MockToken = require('./mocks/token');

  var definition;

  var appPath = path.resolve(__dirname, 'fixtures/ok');
  var expectedAppTokenNames = ['app', 'dep', 'dep2'];

  var multiplePath = path.resolve(__dirname, 'fixtures/error_dbl');

  before(function() {
    Definition._Token = Definition.Token;
    Definition.Token = MockToken;
  });

  beforeEach(function() {
    definition = new Definition();
  });

  it('should allow to add new tokens located in the given path', function() {
    definition.path(appPath);

    _.each(expectedAppTokenNames, function(tokenName) {
      assert(_.findWhere(definition, {name : tokenName}) instanceof Definition.Token);
    });
  });

  it('should throw when an already existing token exists in the given path', function() {
    definition.path(appPath);
    assert.throws(function() {
      definition.path(appPath);
    });
  });

  it('should throw if the given path contains multiple files with the same name', function() {
    assert.throws(function() {
      definition.path(multiplePath);
    });
  });

  it('should throw if definition already contains a token with the same name when calling push', function() {
    definition.push(new MockToken(_.noop, 'added'));
    assert.throws(function() {
      definition.push(new MockToken(_.noop, 'added'));
    });
  });

  it('should throw if pushing a non token object', function() {
    assert.throws(function() {
      definition.push({});
    });
  });

  it('should allow to replace a token', function() {
    definition.push(new MockToken(_.noop, 'replace'));

    var replace = new MockToken(_.noop, 'replace');

    definition.replace(replace);

    assert.strictEqual(_.first(definition), replace);
  });

  it('should throw if replacing a non existant token', function() {
    assert.throws(function() {
      definition.replace(new MockToken(_.noop, 'replace'));
    });
  });

  it('should allow to instantiate an other definition', function() {
    definition.push(new MockToken(_.noop, 'token1'));
    definition.push(new MockToken(_.noop, 'token2'));
    var newDefinition = new Definition(definition);

    assert.deepEqual(definition, newDefinition);
  });

  after(function() {
    Definition.Token = Definition._Token;
    delete Definition._Token;
  });
});

describe('Testing Definition.Token', function() {
  it('should throw if an anonymous function and no name are provided', function() {
    assert.throws(function() {
      new Definition.Token(function() {});
    });
  });

  it('should default to fn.name for the name', function() {
    var token = new Definition.Token(function a() {});
    assert.strictEqual(token.name, 'a');
  });

  it('should use name if provided', function() {
    var token = new Definition.Token(function a() {}, 'b');
    assert.strictEqual(token.name, 'b');
  });

  it('should flag the token as a constructor if the name starts with a capital letter', function() {
    var token = new Definition.Token(function Ab() {});
    assert(token.isConstructor);
  });

  it('should flag the token as a constructor if the provided function has a prototype length', function() {
    var fn = function() {};
    fn.prototype.method = _.noop;
    var token = new Definition.Token(fn, 'a');
    assert(token.isConstructor);
  });
});
