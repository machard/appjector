'use strict';

var _ = require('lodash');
var fnParams = require('fn-params');

/**
 * A Token is a wrapper for a given component function
 * @class
 * @alias appjector.Token
 * @param {Function} fn the function we want as a token
 * @param {string} [name=fn.name] the name we want the token to have
 */
var Token = function(fn, name) {
  /**
  * the token name
  * @type {string}
  */
  this.name = name || fn.name;

  if (!this.name) {
    throw new Error('No name defined');
  }

  var char0 = this.name.charAt(0);
  var prototype = _.merge(fn.prototype, Object.getPrototypeOf(fn.prototype));

  /**
  * flag that indicates if fn is a constructor<br />
  * It checks if fn have a prototype or if this token have a PascalCased name
  * @type {Boolean}
  */
  this.isConstructor = char0.toLowerCase() !== char0 || !!_.keys(prototype).length;

  /**
  * the original function used to create the token
  * @type {Function}
  */
  this.original = fn;

  /**
  * string dependencies of the token (case insensitive)<br />
  * it is built from the given fn arguments
  * @type {Array<string>}
  */
  this.deps = fnParams(fn);
};

/**
 * Returns if the given function is equal this token origin function
 * @param {Function} fn
 * @return {Boolean}
 */
Token.prototype.includes = function(fn) {
  return this.original === fn;
};

/**
 * Returns a clone of this token
 * @return {appjector.Token}
 */
Token.prototype.clone = function() {
  return new Token(this.original, this.name);
};

module.exports = Token;
