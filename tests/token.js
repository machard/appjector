'use strict';

var assert = require('assert');

var Token = require('../src/token');

describe('Testing Token', function() {

  it('should extract deps from arguments', function() {
    var fn = function(dep1, dep2) {}; // jshint ignore:line

    var token = new Token(fn, 'a');

    assert.deepEqual(token.require, ['dep1', 'dep2']);
  });

  it('should return true if including the passed function', function() {
    var fn = function() {}; // jshint ignore:line

    var token = new Token(fn, 'a');

    assert(token.includes(fn));
    assert(!token.includes(function() {}));
  });

});
