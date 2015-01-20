'use strict';

var _ = require('lodash');

/**
 * A Definition contains all app components informations<br />
 * it maintains an array of {@link appjector.Token|tokens}
 * If multiple passed token include the same function, only the last one will be kept
 * @class
 * @alias appjector.Definition
 * @param {...appjector.Token|Array<appjector.Token>} tokens
 */
function Definition() {
  /**
  * Tokens of this definition
  * @type {Array<appjector.Token>}
  */
  this.tokens = [];

  this.push(_.flatten(arguments) || []);
}

/**
 * Push a token to the definition<br />
 * it will add the passed token to this definition tokens<br />
 * If multiple resulting tokens include the same function, only the last one will be kept
 * @param {...appjector.Token|Array<appjector.Token>} tokens
*/
Definition.prototype.push = function() {
  var orderedTokens = _.union(this.tokens, _.flatten(arguments));

  this.tokens = _.reduce(orderedTokens, function(tokensreduced, token) {
    return _.union(_.filter(tokensreduced, function(reduceToken) {
      return !token.includes(reduceToken.original);
    }), [token]);
  }, []);
};

/**
 * Get the token corresponding to the given name
 * @param {string} name
*/
Definition.prototype.get = function(name) {
  return _.findWhere(this.tokens, {name : name});
};

/**
 * Clone this definition
 * @return {appjector.Definition}
*/
Definition.prototype.clone = function() {
  var definition = new Definition();
  definition.push(_.map(this.tokens, function(token) {
    return token.clone();
  }));
  return definition;
};

/**
 * Replace a token in the definition<br />
 * It will replace the token matching the given token name
 * @param {appjector.Token} token
*/
Definition.prototype.replace = function(token) {
  var toBeReplacedIndex = this.tokens.indexOf(_.findWhere(this.tokens, {name : token.name}));

  if (toBeReplacedIndex < 0) {
    throw new Error('Original token not found');
  }

  this.tokens.splice(toBeReplacedIndex, 1, token);
};

module.exports = Definition;
