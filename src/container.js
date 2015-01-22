'use strict';

var _ = require('lodash');

/**
 * A Container is in charge of getting components value from {@link Token|tokens}
 * @class
 * @param {Definition} definition the definition on which the container is based
 * @param {DependenciesNameValueMap} [dependencies] optional external dependencies
 */
function Container(definition, dependencies) {
  var tokenNames = definition.names().concat(_.keys(dependencies));

  if (tokenNames.length > _.uniq(tokenNames).length) {
    throw new Error('multiple tokens have the same name');
  }

  this.definition = definition;

  this.cache = dependencies || {};
  this.resolving = [];
}

/**
 * run every {@link Token|tokens} of this container
 * @return {Container} the instance on which this method is called
 */
Container.prototype.run = function() {
  _.each(this.definition.names(), this.get, this);
  return this;
};

/**
 * Return the value associated with the {@link Token|token}
 * @param {string} tokenName
 * @return {Object|function|Number|array}
 */
Container.prototype.get = function(tokenName) {
  if (this.cache[tokenName]) {
    return this.cache[tokenName];
  }

  var token = this.definition.get(tokenName);

  if (!token) {
    throw new Error('Unknown token name ' +  tokenName);
  }

  if (this.resolving.indexOf(token) > -1) {
    throw new Error('Cyclic dependency for ' + tokenName);
  }

  this.resolving.push(token);

  var deps = _.map(token.require, this.get, this);

  this.cache[tokenName] = token.getter.apply(null, deps);

  this.resolving = _.without(this.resolving, token);

  return this.cache[tokenName];
};

module.exports = Container;
