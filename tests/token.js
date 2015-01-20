'use strict';

var assert = require('assert');
var _ = require('lodash');
var util = require('util');

var Token = require('../index').Token;

describe('Testing Token', function() {
  it('should throw if an anonymous function and no name are provided', function() {
    assert.throws(function() {
      new Token(function() {});
    });
  });

  it('should default to fn.name for the name', function() {
    var token = new Token(function a() {});
    assert.strictEqual(token.name, 'a');
  });

  it('should use name if provided', function() {
    var token = new Token(function a() {}, 'b');
    assert.strictEqual(token.name, 'b');
  });

  it('should flag the token as a constructor if the name starts with a capital letter', function() {
    var token = new Token(function Ab() {});
    assert(token.isConstructor);
  });

  it('should flag the token as a constructor if the provided function has a prototype length', function() {
    var fn = function() {};
    fn.prototype.method = _.noop;
    var token = new Token(fn, 'a');
    assert(token.isConstructor);
  });

  it('should flag the token as a constructor if the provided function inherits', function() {
    var fn = function() {};
    fn.prototype.method = _.noop;

    var herit = function() {};
    util.inherits(herit, fn);

    var token = new Token(herit, 'a');
    assert(token.isConstructor);
  });

  it('should extract deps from arguments', function() {
    var fn = function(dep1, dep2) {}; // jshint ignore:line

    var token = new Token(fn, 'a');

    assert.deepEqual(token.deps, ['dep1', 'dep2']);
  });

  it('should allow to clone', function() {
    var fn = function(dep1, dep2) {}; // jshint ignore:line

    var token = new Token(fn, 'a');

    var clone = token.clone();

    assert.equal(token.name, clone.name);
    assert.strictEqual(token.original, clone.original);

    assert.deepEqual(token.deps, clone.deps);
  });
});
