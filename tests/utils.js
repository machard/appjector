'use strict';

var path = require('path');
var assert = require('assert');
var _ = require('lodash');

var utils = require('../index').utils;

describe('testing utils', function() {
  it('should returns all compatible files as tokens', function() {
    var testpath = './tests/fixtures/ok';

    var tokens = utils.pathToTokens(testpath);

    //assert(!_.findWhere(tokens, {name : 'nofunction'}));
    assert(_.findWhere(tokens, {name : 'app'}).includes(require(path.resolve(testpath, 'app'))));
    assert(_.findWhere(tokens, {name : 'dep'}).includes(require(path.resolve(testpath, 'dep'))));
    assert(_.findWhere(tokens, {name : 'dep2'}).includes(require(path.resolve(testpath, 'modules/dep2'))));
  });
});
