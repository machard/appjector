'use strict';

var _ = require('lodash');
var path = require('path');
var fs = require('fs');

var Token = require('./token');

/** @namespace appjector.utils */
module.exports = {
  /**
   * Return an array of {@link appjector.Token|tokens} built from files in the given path
   * @param {string} basePath The path in which to search (recursive)
   * @memberof appjector.utils
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

      return _.union(tokens, [new Token(module, path.basename(file, path.extname(file)))]);
    }, []));
  }
};
