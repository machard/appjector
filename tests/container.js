'use strict';

var assert = require('assert');
var sinon = require('sinon');
var _ = require('lodash');

var Container = require('../src/container');
var Tocken = require('../src/token');
var Definition = require('../src/definition');

describe('testing Container', function() {
  it('should throw an error if multiple token have the same name', function() {
    assert.throws(function() {
      new Container(new Definition([
        new Tocken(function() {}, 'name'), new Tocken(function() {}, 'name')
      ]));
    });
  });

  it('should throw an error if multiple token and/or dependencies have the same name', function() {
    assert.throws(function() {
      new Container(new Definition([
        new Tocken(function() {}, 'name'), new Tocken(function() {}, 'name2')
      ]), {'name' : {}});
    });
  });

  context('when instancied correctly', function() {
    var container, spies;

    beforeEach(function() {
      spies = _.object(_.map(['main', 'dep', 'Klass'], function(name) {
        return [name, sinon.spy(function() {
          return {name : name};
        })];
      }));

      container = new Container(new Definition([
        new Tocken(function(extra, dep) {
          return spies.main(dep);
        }, 'main'),
        new Tocken(function() {
          return spies.dep();
        }, 'dep'),
        new Tocken(spies.Klass, 'Klass')
      ]), {extra : 'pouet'});
    });

    it('should throw error if asking for a non existent token', function() {
      assert.throws(function() {
        container.get('nonexistent');
      });
    });

    it('should inject dependency value', function() {
      container.get('main');
      assert(spies.main.calledWith(container.get('dep')));
    });

    it('should always return the exact same value', function() {
      assert.strictEqual(container.get('dep'), container.get('dep'));
    });

    it('should instantiate every token', function() {
      container.run();
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
        new Tocken(function(cyclic2) {
          return spies.cyclic1(cyclic2);
        }, 'cyclic1'),
        new Tocken(function(cyclic1) {
          return spies.cyclic2(cyclic1);
        }, 'cyclic2')
      ]));
    });

    it('should throw error when get find a cyclic dependency', function() {
      assert.throws(function() {
        container.get('cyclic1');
      });
    });

    it('should throw error when instantiate find a cyclic dependency', function() {
      assert.throws(function() {
        container.run();
      });
    });
  });
});
