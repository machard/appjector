'use strict';

var _ = require('lodash');
var util = require('util');

var Container = require('./container');
var Token = require('./token');

/**
 * A ContainerToken is a wrapper for a component function returning a {@link Container|container}
 * @class
 * @param {Definition} definition the definition that will be used to create the container
 * @param {Array<string>} [require] Array of dependencies as string
 * @param {string} name the name we want this token to have
 * @extends {Token}
 */
var ContainerToken = function(name, definition, require) {
  Token.call(this, function() {
    return (new Container(definition, _.object(require, arguments))).run();
  }, name);

  /**
  * The required dependencies names of this container token<br />
  * it is passed to the containertoken constructor
  * @type {Array<string>}
  * @default []
  */
  this.require = require || [];

  /**
  * The definition of this container token
  * @type {Definition}
  */
  this.definition = definition;
};

util.inherits(ContainerToken, Token);

/**
 * Returns true if the given function is included in this token definition
 * @param {Function} fn
 * @return {Boolean}
 */
ContainerToken.prototype.includes = function(fn) {
  return _.some(this.definition.tokens, function(inToken) {
    return inToken.includes(fn);
  });
};

module.exports = ContainerToken;
