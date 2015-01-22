'use strict';

var path = require('path');
var assert = require('assert');
var _ = require('lodash');

var utils = require('../src/utils');

describe('testing appjector utils', function() {
  var testpath = './tests/fixtures/ok';

  it('should returns all compatible files as tokens', function() {
    var tokens = utils.pathToTokens(testpath);

    assert(!_.findWhere(tokens, {name : 'nofunction'}));
    assert(_.findWhere(tokens, {name : 'app'}).includes(require(path.resolve(testpath, 'app'))));
    assert(_.findWhere(tokens, {name : 'dep'}).includes(require(path.resolve(testpath, 'dep-^'))));
    assert(_.findWhere(tokens, {name : 'dep2'}).includes(require(path.resolve(testpath, 'module/dep2'))));
  });
});
