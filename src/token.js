'use strict';

var fnParams = require('fn-params');

/**
 * A Token is a wrapper for a given component function
 * @class
 * @param {Function} fn the function we want as a token
 * @param {string} name the name we want the token to have
 */
var Token = function(fn, name) {
  /**
  * the token name
  * @type {string}
  */
  this.name = name;

  /**
  * the function to run passing the required dependencies to get the component value
  * @type {Function}
  */
  this.getter = fn;

  /**
  * required dependencies names of this token<br />
  * it is built from the given fn arguments
  * @type {Array<string>}
  */
  this.require = fnParams(fn);
};

/**
 * Returns true if the given function is equal to this token getter function
 * @param {Function} fn
 * @return {Boolean}
 */
Token.prototype.includes = function(fn) {
  return this.getter === fn;
};

module.exports = Token;
