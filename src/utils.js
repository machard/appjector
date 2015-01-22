'use strict';

var _ = require('lodash');
var fs = require('fs');
var path = require('path');

var Token = require('./token');

/** @namespace utils */
module.exports = {
  /**
   * Return an array of {@link Token|tokens} built from files in the given path
   * @param {string} basePath The path in which to search (recursive)
   * @memberof utils
  */
  pathToTokens : function pathToTokens(basePath) {
    basePath = fs.realpathSync(basePath);

    return _.flatten(_.reduce(fs.readdirSync(basePath), function(tokens, file) {
      file = path.join(basePath, file);

      if (fs.statSync(file).isDirectory()) {
        return _.union(tokens, pathToTokens(file));
      }

      if (!/\.js$/.test(file)) {
        return tokens;
      }

      var module = require(file);

      if (!_.isFunction(module)) {
        return tokens;
      }

      var name = path.basename(file, path.extname(file));
      name = name.replace(/[^\w\d]/g, '');

      return _.union(tokens, [new Token(module, name)]);
    }, []));
  }
};
