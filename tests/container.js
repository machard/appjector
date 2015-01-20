'use strict';

var assert = require('assert');
var sinon = require('sinon');
var _ = require('lodash');

var Container = require('../index').Container;
var Tocken = require('../index').Token;
var Definition = require('../index').Definition;

describe('testing Container', function() {
  it('should throw an error if multiple token have the same name (case insensitive)', function() {
    assert.throws(function() {
      new Container(new Definition([
        new Tocken(function() {}, 'name'), new Tocken(function() {}, 'name')
      ]));
    });
  });

  context('when instancied correctly', function() {
    var container, spies;

    beforeEach(function() {
      spies = _.object(_.map(['main', 'dep', 'klass'], function(name) {
        return [name, sinon.spy(function() {
          return {name : name};
        })];
      }));

      container = new Container(new Definition([
        new Tocken(function main(dep) {
          return spies.main(dep);
        }),
        new Tocken(function dep() {
          return spies.dep();
        }),
        new Tocken(spies.klass, 'Klass')
      ]));
    });

    it('should throw error if asking for a non existent token', function() {
      assert.throws(function() {
        container.get('nonexistent');
      });
    });

    it('should return the asked instanciated token no matter the name case', function() {
      assert.strictEqual(container.get('dEp').name, 'dep');
    });

    it('should inject dependency value', function() {
      container.get('main');
      assert(spies.main.calledWith(container.get('dep')));
    });

    it('should always return the exact same value', function() {
      assert.strictEqual(container.get('dep'), container.get('dep'));
    });

    it('should instantiate using new if the token is a constructor', function() {
      container.get('klass');
      assert(spies.klass.calledWithNew());
    });

    it('should instantiate every token', function() {
      container.instantiate();
      _.each(spies, function(spy) {
        assert(spy.calledOnce);
      });
    });
  });

  context('when instancied with tokens containing circular dependencies', function() {
    var container, spies;

    beforeEach(function() {
      spies = _.object(_.map(['cyclic1', 'cyclic2'], function(name) {
        return [name, sinon.spy(function() {
          return {name : name};
        })];
      }));

      container = new Container(new Definition([
        new Tocken(function cyclic1(cyclic2) {
          return spies.cyclic1(cyclic2);
        }),
        new Tocken(function cyclic2(cyclic1) {
          return spies.cyclic2(cyclic1);
        })
      ]));
    });

    it('should throw error when get find a cyclic dependency', function() {
      assert.throws(function() {
        container.get('cyclic1');
      });
    });

    it('should throw error when instantiate find a cyclic dependency', function() {
      assert.throws(function() {
        container.instantiate();
      });
    });
  });
});
