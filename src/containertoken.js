'use strict';

var _ = require('lodash');
var util = require('util');

var Container = require('./container');
var Token = require('./token');

/**
 * A ContainerToken is a wrapper for a {@link appjector.Container|container} component
 * @class
 * @alias appjector.ContainerToken
 * @param {appjector.Definition} definition the definition that will be used to create the container
 * @param {Array<string>} [deps] Array of dependencies as string (case insensitive)
 * @param {string} name the name we want this token to have
 */
var ContainerToken = function(name, deps, definition) {
  definition = definition || deps;
  deps = definition !== deps ? deps : null;

  var ct = this;

  var fn = function() {
    var heritedTokens = _.map(_.object(ct.deps, arguments), function(value, name) {
      return new Token(function() {
        return value;
      }, name);
    });

    var def = ct.definition.clone();
    def.push(heritedTokens);

    Container.call(this, def);

    this.instantiate();
  };

  util.inherits(fn, Container);

  /**
  * the customized Container constructor
  * @type {appjector.Container}
  */
  this.original = fn;

  /**
  * the token name
  * @type {string}
  */
  this.name = name;

  /**
  * @constant
  * @default true
  * @type {boolean}
  */
  this.isConstructor = true;

  /**
  * The top dependencies of this container token<br />
  * it can reference dependencies available in the same definition this containertoken is
  * @type {Array<string>}
  */
  this.deps = deps || [];

  /**
  * The definition of this container token
  * @type {appjector.Definition}
  */
  this.definition = definition;
};

/**
 * Returns if the given function is included in this token definition
 * @param {Function} fn
 * @return {Boolean}
 */
ContainerToken.prototype.includes = function(fn) {
  return _.some(this.definition.tokens, function(inToken) {
    return inToken.includes(fn);
  });
};

/**
 * Returns a clone of this token
 * @return {appjector.ContainerToken}
 */
ContainerToken.prototype.clone = function() {
  return new ContainerToken(this.name, this.deps, this.definition.clone());
};

module.exports = ContainerToken;
