'use strict';

var _ = require('lodash');
var Token = require('./token');
var Definition = require('./definition');

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

  this._definition = definition;
  this._dependencies = dependencies;

  this.cache = dependencies || {};
  this.resolving = [];
}

/**
 * clone this container
 * @return {Container}
 */
Container.prototype.clone = function() {
  return new Container(this.definition().clone(), _.clone(this._dependencies));
};

/**
 * run every {@link Token|tokens} of this container
 * @return {Container} the instance on which this method is called
 */
Container.prototype.run = function() {
  _.each(this.definition().names(), this.get, this);
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

  var token = this.definition().get(tokenName);

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

/**
 * @private
 * Return the definition of the container located at tree
 * @param {string[]} [tree=[]]
 * @return {Definition}
 */
Container.prototype.definition = function(tree) {
  tree = tree || [];

  return _.reduce(tree, function(definition, path) {
    return definition.get(path).definition;
  }, this._definition);
};

/**
 * Allows to isolate a component and mock it's dependencies
 * @param {Container} container
 * @param {string[]} tree the component tree to the one to isolate
 * @param {DependenciesNameValueMap} dependencies the dependencies needed by the component not present in the isolated portion
 * @return {Object|function|string|number|array}
 */
Container.prototype.isolate = function(tree, dependencies) {

  var name = tree.pop();

  return (new Container(
    new Definition(this.definition(tree).get(name)),
    dependencies
  )).get(name);

};

/**
 * Allows to replace a component
 * @param {Container} container
 * @param {string[]} tree the component tree to the one to replace
 * @param {Object|function|string|number|array} replacement the new component
 * @return {Container}
 */
Container.prototype.replace = function(tree, replacement) {

  var container = this.clone();
  var name = tree.pop();

  container.definition(tree).replace(new Token(_.constant(replacement), name));

  return container;
};

module.exports = Container;
