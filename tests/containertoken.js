'use strict';

var assert = require('assert');

var ContainerToken = require('../src/containertoken');
var Definition = require('../src/definition');
var Tocken = require('../src/token');
var Container = require('../src/container');

describe('Testing ContainerToken', function() {
  var containerToken, token, subtoken;

  function getReconizableFn(name) {
    return function() {
      return name;
    };
  }

  beforeEach(function() {
    token = new Tocken(getReconizableFn('token'), 'token');

    subtoken = new Tocken(getReconizableFn('subtoken'), 'subtoken');
    var subContainerToken = new ContainerToken('sub', new Definition([subtoken]));

    containerToken = new ContainerToken(
      'Name',
      new Definition([
        token,
        subContainerToken
      ]),
      ['dep1', 'dep2']
    );
  });

  it('should include token and subtoken', function() {
    assert(containerToken.includes(token.getter));
    assert(containerToken.includes(subtoken.getter));
  });

  it('should have a getter returning a container containing the defined token + the required top dependencies', function() {
    var container = containerToken.getter('dep1', 'dep2');

    assert(container instanceof Container);

    assert.strictEqual(container.get('dep1'), 'dep1');
    assert.strictEqual(container.get('dep2'), 'dep2');
    assert.strictEqual(container.get('token'), 'token');

    assert.strictEqual(container.get('sub').get('subtoken'), 'subtoken');
  });

});
