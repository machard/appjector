'use strict';

var assert = require('assert');

var Token = require('../src/token');

describe('Testing Token', function() {

  it('should extract deps from fn arguments', function() {
    var fn = function(dep1, dep2) {}; // jshint ignore:line

    var token = new Token(fn, 'a');

    assert.deepEqual(token.require, ['dep1', 'dep2']);
  });

  it('should take deps from arguments if provided', function() {
    var fn = function(dep1, dep2) {}; // jshint ignore:line

    var token = new Token(fn, 'a', ['dep']);

    assert.deepEqual(token.require, ['dep']);
  });

  it('should return true if including the passed function', function() {
    var fn = function() {}; // jshint ignore:line

    var token = new Token(fn, 'a');

    assert(token.includes(fn));
    assert(!token.includes(function() {}));
  });

  it('should clone', function() {
    var fn = function(dep1, dep2) {}; // jshint ignore:line

    var token = new Token(fn, 'a');

    var clone = token.clone();

    assert.notEqual(token, clone);

    assert.equal(token.name, clone.name);
    assert.strictEqual(token.getter, clone.getter);
    assert.deepEqual(token.require, clone.require);
  });

});
