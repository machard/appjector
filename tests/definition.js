'use strict';

var assert = require('assert');
var _ = require('lodash');

var Definition = require('../index').Definition;
var Tocken = require('../index').Token;

describe('testing Definition', function() {

  it('should allow to instantiate with multiple tokens/array of tokens', function() {
    var token = new Tocken(function() {}, 'token');
    var token1 = new Tocken(function() {}, 'token1');
    var token2 = new Tocken(function() {}, 'token2');

    var definition = new Definition(token1, [token2, token]);

    assert.strictEqual(definition.get('token'), token);
    assert.equal(definition.get('token1'), token1);
    assert.equal(definition.get('token2'), token2);
  });

  it('should keep the last token wrapping a given fn', function() {
    var token1 = new Tocken(function() {}, 'token1');
    var token2 = new Tocken(token1.original, 'token2');

    var definition = new Definition([token1, token2]);

    assert(!definition.get('token1'));
    assert(definition.get('token2'));
  });

  it('should allow to use push with multiple tokens/array of tokens', function() {
    var token = new Tocken(function() {}, 'token');
    var token1 = new Tocken(function() {}, 'token1');
    var token2 = new Tocken(function() {}, 'token2');

    var definition = new Definition();

    definition.push(token1, [token2, token]);

    assert.strictEqual(definition.get('token'), token);
    assert.equal(definition.get('token1'), token1);
    assert.equal(definition.get('token2'), token2);
  });

  it('should keep the last token added wrapping a given fn', function() {
    var token1 = new Tocken(function() {}, 'token1');
    var token2 = new Tocken(token1.original, 'token2');

    var definition = new Definition(token1);

    definition.push(token2);

    assert(!definition.get('token1'));
    assert(definition.get('token2'));
  });

  it('should allow to replace a token', function() {
    var definition = new Definition(new Tocken(function() {}, 'replace'));

    var replace = new Tocken(function() {}, 'replace');

    definition.replace(replace);

    assert.strictEqual(definition.get('replace'), replace);
  });

  it('should throw if replacing a non existant token', function() {
    var definition = new Definition();

    assert.throws(function() {
      definition.replace(new Tocken(_.noop, 'replace'));
    });
  });

  it('should clone definition', function() {
    var token1 = new Tocken(function() {}, 'token1');
    var token2 = new Tocken(function() {}, 'token2');

    var definition = new Definition(token1, token2);

    var newDefinition = definition.clone();

    assert.notEqual(newDefinition, definition);

    assert(definition.get('token1'));
    assert(definition.get('token2'));

    assert.notEqual(definition.get('token1'), newDefinition.get('token1'));
    assert.notEqual(definition.get('token2'), newDefinition.get('token2'));
  });
});
