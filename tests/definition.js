'use strict';

var assert = require('assert');

var Definition = require('../src/definition');
var Tocken = require('../src/token');

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

  it('should return the name of all tokens', function() {
    var token = new Tocken(function() {}, 'token');
    var token1 = new Tocken(function() {}, 'token1');
    var token2 = new Tocken(function() {}, 'token2');

    var definition = new Definition(token1, [token2, token]);

    assert.deepEqual(definition.names(), ['token1', 'token2', 'token']);
  });

  it('should keep the last token wrapping a given fn', function() {
    var token1 = new Tocken(function() {}, 'token1');
    var token2 = new Tocken(token1.getter, 'token2');

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
    var token2 = new Tocken(token1.getter, 'token2');

    var definition = new Definition(token1);

    definition.push(token2);

    assert(!definition.get('token1'));
    assert(definition.get('token2'));
  });
});
