'use strict';

var assert = require('assert');

var appjector = require('../src/appjector');
var Container = require('../src/container');

describe('testing appjector container factory', function() {

  it('should return a Container', function() {
    var c = appjector.container({token : 'pouet'}, './tests/fixtures/ok', {
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
      token : 'token',
      token2 : 'token2'
    });

    assert.equal(c.get('token'), 'token');
    assert.equal(c.get('token2'), 'token2');
  });
});
