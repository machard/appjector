'use strict';

var assert = require('assert');

var appjector = require('../src/appjector');
var Container = require('../src/container');
var AppSwitch = require('../src/appswitch');

describe('testing appjector container factory', function() {

  it('should return a Container', function() {
    var c = appjector.container({token : function() {return 'pouet';}}, './tests/fixtures/ok', {
      'module' : {
        require : ['token'],
      }
    });

    assert(c instanceof Container);

    assert.equal(c.get('module').get('token'), 'pouet');
  });

  it('should allow to skip dependencies', function() {
    var c = appjector.container('./tests/fixtures/ok', {
      'module' : {}
    });

    assert(c instanceof Container);

    assert.equal(c.get('module').get('dep2'), 'dep2');
  });

  it('should allow to specify only dependencies', function() {
    var c = appjector.container({
      token : function() {return 'token';},
      token2 : function() {return 'token2';}
    });

    assert.equal(c.get('token'), 'token');
    assert.equal(c.get('token2'), 'token2');
  });

  it('should expose an AppSwitch component', function() {
    var as = appjector.AppSwitch();

    assert(as instanceof AppSwitch);
  });
});
