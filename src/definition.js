'use strict';

var _ = require('lodash');
var path = require('path');
var fs = require('fs');

/**
 * The built-in class for managing arrays.
 * @external Array
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
 */

/**
 * A Definition contains all app components informations<br />
 * it is basically an array of {@link appjector.Definition.Token|tokens} with extra methods described below
 * @class
 * @alias appjector.Definition
 * @param {appjector.Definition} [definition] the new definition will be created as a copy of the given definition
 * @extends external:Array
 */
function Definition(definition) {
  Array.apply(this);

  this.push.apply(this, definition);
}

Definition.prototype = _.clone(Array.prototype);

Definition.prototype.push = function() {
  var self = this;

  _.each(arguments, function(token) {
    if (!(token instanceof Definition.Token)) {
      throw new Error('Only Token objects can be added to a definition');
    }

    if (_.findWhere(self, {name : token.name})) {
      throw new Error('A token with this name is already present ' + token.name);
    }

    Array.prototype.push.call(self, token);
  });
};

/**
 * Add components located in the given path to the definition
 * @param {string} basePath
*/
Definition.prototype.path = function(basePath) {
  var self = this;

  basePath = fs.realpathSync(basePath);

  _.each(fs.readdirSync(basePath), function(file) {
    var filepath = path.join(basePath, file);
    var ext = path.extname(file);

    if (fs.statSync(filepath).isDirectory()) {
      return self.path(filepath);
    }

    if (ext !== '.js') {
      return;
    }

    self.push(new Definition.Token(require(filepath), path.basename(file, ext)));
  });
};

/**
 * Replace a token in the definition<br />
 * It will replace the token matching the given token name</br >
 * @param {appjector.Definition.Token} token
*/
Definition.prototype.replace = function(token) {
  var toBeReplacedIndex = this.indexOf(_.findWhere(this, {name : token.name}));

  if (toBeReplacedIndex < 0) {
    throw new Error('Original token not found');
  }

  this.splice(toBeReplacedIndex, 1, token);
};

/**
 * A Token is a wrapper for a given component function
 * @class
 * @param {Function} fn the function we want as a token
 * @param {string} [name=fn.name] the name we want the token to have
 */
Definition.Token = function(fn, name) {
  /**
  * the token name
  * @type {string}
  */
  this.name = name || fn.name;

  if (!this.name) {
    throw new Error('No name defined');
  }

  var char0 = this.name.charAt(0);

  /**
  * flag that indicates if fn is a constructor<br />
  * It checks if fn have a prototype or if this token have a PascalCased name
  * @type {Boolean}
  */
  this.isConstructor = char0.toLowerCase() !== char0 || !!_.keys(fn.prototype).length;

  /**
  * the original function used to create the token
  * @type {Function}
  */
  this.original = fn;
};

module.exports = Definition;
