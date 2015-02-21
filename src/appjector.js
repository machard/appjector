'use strict';

var _ = require('lodash');
var path = require('path');

var Container = require('./container');
var Token = require('./token');
var ContainerToken = require('./containertoken');
var Definition = require('./definition');
var utils = require('./utils');

/**
 * @typedef ModuleConfig
 * @type Object
 * @property {string[]} [require] - names of the required dependencies
 * @property {DependenciesNameValueMap} [dependencies] - Map name -> value of manually defined dependencies
 * @property {ModulesPathConfigMap} [modules] - Submodules configuration map
 */

 /**
 * @typedef ModulesPathConfigMap
 * @type {Object.<string, ModuleConfig>}
 */

/**
 * @typedef DependenciesNameValueMap
 * @type {Object.<string, Object|function|string|number|array>}
 */

/** @namespace appjector */
var appjector = {};

/**
 * creates a {@link Container|container}<br />
 * either dependencies or cpath need to be set<br />
 * modules can only be used when a cpath is provided<br />
 * @param {DependenciesNameValueMap} [dependencies]
 * @param {string} [cpath]
 * @param {ModulesPathConfigMap} [modules]
 * @return {Container}
 */
appjector.container = function(dependencies, cpath, modules) {
  if (_.isString(dependencies)) {
    modules = cpath;
    cpath = dependencies;
    dependencies = null;
  }

  function definition(dependencies, cpath, modules) {
    return new Definition(
      cpath ? utils.pathToTokens(cpath) : [],

      _.map(dependencies, function(value, name) {
        return new Token(_.constant(value), name);
      }),

      _.map(modules, function(module, mpath) {
        return new ContainerToken(
          path.basename(mpath, path.extname(mpath)),
          definition(module.dependencies, path.join(cpath, mpath), module.modules),
          module.require
        );
      })
    );
  }

  return new Container(definition(dependencies, cpath, modules));
};

appjector.AppSwitch = require('./appswitch');

module.exports = appjector;
