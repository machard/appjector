'use strict';

var _ = require('lodash');
var util = require('util');

/**
 * A Container is in charge of instantiating {@link appjector.Token|tokens}
 * @class
 * @alias appjector.Container
 * @param {appjector.Definition} definition the definition on which the container is based
 */
function Container(definition) {
  this.tokensMap = _.object(_.map(definition.tokens, function(token) {
    return [token.name.toLowerCase(), token];
  }));

  this.cache = {};
  this.resolving = [];

  if (_.keys(this.tokensMap).length < definition.tokens.length) {
    throw new Error('multiple tokens have the same name (case insensitive check)');
  }
}

/**
 * Instantiate every {@link appjector.Token|tokens} of this container
 */
Container.prototype.instantiate = function() {
  _.each(_.keys(this.tokensMap), this.get, this);
};

/**
 * Return the instantiated {@link appjector.Token|token}<br />
 * if the {@link appjector.Token|token} is a constructor, new will be used
 * @param {string} tokenName the name of the token. case insensitive
 * @return {Object} returns the instantiated token
 */
Container.prototype.get = function(tokenName) {
  var token = this.tokensMap[tokenName.toLowerCase()];

  if (!token) {
    throw new Error('Unknown token name ' +  tokenName);
  }

  if (this.resolving.indexOf(token) > -1) {
    throw new Error('Cyclic dependency for ' + token.name);
  }

  if (this.cache[token.name]) {
    return this.cache[token.name];
  }

  this.resolving.push(token);

  var deps = _.map(token.deps, this.get, this);

  if (token.isConstructor) {
    var F = function() {
      token.original.apply(this, deps);
    };
    util.inherits(F, token.original);

    this.cache[token.name] = new F();
  } else {
    this.cache[token.name] = token.original.apply(null, deps);
  }

  this.resolving = _.without(this.resolving, token);

  return this.cache[token.name];
};

module.exports = Container;
