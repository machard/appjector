'use strict';

var assert = require('assert');

var ContainerToken = require('../index').ContainerToken;
var Definition = require('../index').Definition;
var Tocken = require('../index').Token;
var Container = require('../index').Container;

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
      'name',
      ['dep1', 'dep2'],
      new Definition([
        token,
        subContainerToken
      ])
    );
  });

  it('should have name', function() {
    assert.equal(containerToken.name, 'name');
  });

  it('should have given deps', function() {
    assert.deepEqual(containerToken.deps, ['dep1', 'dep2']);
  });

  it('should include token and subtoken', function() {
    assert(containerToken.includes(token.original));
    assert(containerToken.includes(subtoken.original));
  });

  it('should return a container containing the defined token + the required top dependencies', function() {
    var container = new containerToken.original('dep1', 'dep2');

    assert(container instanceof Container);

    assert.strictEqual(container.get('dep1'), 'dep1');
    assert.strictEqual(container.get('dep2'), 'dep2');
    assert.strictEqual(container.get('token'), 'token');

    assert.strictEqual(container.get('sub').get('subtoken'), 'subtoken');
  });

  it('should allow to clone', function() {
    var clone = containerToken.clone();

    assert.equal(containerToken.name, clone.name);
    assert.deepEqual(containerToken.deps, clone.deps);

    assert.notEqual(clone.definition, containerToken.definition);

    assert.notEqual(clone.definition.get('token'), containerToken.definition.get('token'));
    assert.equal(clone.definition.get('token').original, containerToken.definition.get('token').original);
  });

});
