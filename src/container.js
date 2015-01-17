'use strict';

var _ = require('lodash');
var fnParams = require('fn-params');

/**
 * A Container is in charge of instantiating tokens
 * @class
 * @alias appjector.Container
 * @param {Array.<appjector.Definition.Token>} tokens The tokens list
 */
function Container(tokens) {
  this.tokensMap = _.object(_.map(tokens, function(token) {
    return [token.name.toLowerCase(), token];
  }));
  this.cache = {};
  this.resolving = [];

  if (_.keys(this.tokensMap).length < tokens.length) {
    throw new Error('multiple tokens have the same name (case insensitive check)');
  }
}

/**
 * Instantiate every token of this container
 */
Container.prototype.instantiate = function() {
  _.each(_.keys(this.tokensMap), this.get, this);
};

/**
 * Return the instantiated token<br />
 * if the token is a constructor, new will be used<br />
 * @param {string} tokenName the name of the token. case insensitive
 * @return {Object} returns the instantiated token
 */
Container.prototype.get = function(tokenName) {
  var token = this.tokensMap[tokenName.toLowerCase()];

  if (!token) {
    throw new Error('Unknown token name ' +  token.name);
  }

  if (this.resolving.indexOf(token) > -1) {
    throw new Error('Cyclic dependency for ' + token.name);
  }

  if (this.cache[token.name]) {
    return this.cache[token.name];
  }

  this.resolving.push(token);

  var deps = _.map(fnParams(token.original), this.get, this);

  if (token.isConstructor) {
    var F = function F() {
      token.original.apply(this, deps);
    };
    F.prototype = token.original.prototype;

    this.cache[token.name] = new F();
  } else {
    this.cache[token.name] = token.original.apply(null, deps);
  }

  this.resolving = _.without(this.resolving, token);

  return this.cache[token.name];
};

module.exports = Container;
