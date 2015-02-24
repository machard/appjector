'use strict';

var assert = require('assert');
var sinon = require('sinon');
var _ = require('lodash');

var Container = require('../src/container');
var Tocken = require('../src/token');
var Definition = require('../src/definition');
var appjector = require('../src/appjector');

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
      spies = _.object(_.map(['main', 'dep', 'Klass', 'ct'], function(name) {
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
        new Tocken(spies.Klass, 'Klass'),
        new Tocken(function() {
          var c = new Container(new Definition());
          c.run = spies.ct;
          return c;
        }, 'ct')
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

    it('should instantiate every token and run container components', function() {
      container.run();
      _.each(spies, function(spy) {
        assert(spy.calledOnce);
      });
    });

    it('should clone', function() {
      var clone = container.clone();

      assert.notEqual(clone, container);
      assert.notEqual(clone._dependencies, container._dependencies);
      assert.notEqual(clone._definition, container._definition);

      assert.deepEqual(clone._dependencies, container._dependencies);
      assert.deepEqual(clone._definition.names(), container._definition.names());
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

describe('testing Container utils', function() {
  var c;
  beforeEach(function() {
    c = appjector.container('./tests/fixtures/ok', {
      'module' : {
        dependencies : {token : 'pouet'},
        modules : {
          'sub' : {
            require : ['token']
          }
        }
      }
    });
  });

  it('should allow to isolate a component', function() {
    var moduleWithMockedToken = c.isolate(['module', 'sub'], {token : 'pouet'});

    assert.equal(moduleWithMockedToken.get('token'), 'pouet');
  });

  it('should return a container with a component replaced', function() {
    var container = c.replace(['module', 'sub'], 'pouet');

    assert.equal(container.get('module').get('sub'), 'pouet');
    assert.notEqual(container, c);
  });
});
