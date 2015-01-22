'use strict';

var _ = require('lodash');

/**
 * A Definition contains all app tokens informations<br />
 * it maintains an array of {@link Token|tokens}<br />
 * If multiple passed token include the same getter, only the last one will be kept
 * @class
 * @param {...Token|Array<Token>} tokens
 */
function Definition() {
  /**
  * Tokens of this definition
  * @type {Array<Token>}
  */
  this.tokens = [];

  this.push(_.flatten(arguments) || []);
}

/**
 * Push a token to the definition<br />
 * it will add the passed tokens to this definition tokens<br />
 * If multiple resulting tokens include the same getter, only the last one will be kept
 * @param {...Token|Array<Token>} tokens
*/
Definition.prototype.push = function() {
  var orderedTokens = _.union(this.tokens, _.flatten(arguments));

  this.tokens = _.reduce(orderedTokens, function(tokensreduced, token) {
    return _.union(_.filter(tokensreduced, function(reduceToken) {
      return !token.includes(reduceToken.getter);
    }), [token]);
  }, []);
};

/**
 * Get the first token corresponding to the given name
 * @param {string} name
*/
Definition.prototype.get = function(name) {
  return _.findWhere(this.tokens, {name : name});
};

/**
 * Get the names of this definition's tokens
 * @param {string[]}
*/
Definition.prototype.names = function() {
  return _.pluck(this.tokens, 'name');
};

module.exports = Definition;
