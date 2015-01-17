'use strict';

var assert = require('assert');
var sinon = require('sinon');
var _ = require('lodash');

var AppSwitch = require('../index').AppSwitch;

describe('testing AppSwitch', function() {
  var appswitch;

  var stubs = {
    start : [sinon.stub(), sinon.stub()],
    stop : [sinon.stub(), sinon.stub()]
  };

  beforeEach(function() {
    appswitch = new AppSwitch();

    _.each(_.union(stubs.start, stubs.stop), function(stub) {
      stub.reset();
      delete stub.callTime;
      stub.callsArgAsync(0);

      function cb(callback) {
        stub.callTime = new Date().getTime();
        setTimeout(_.partial(stub, callback), 2);
      }

      if (_.contains(stubs.start, stub)) {
        appswitch.onStart(cb);
      } else {
        appswitch.onStop(cb);
      }
    });

  });

  context('when not started', function() {
    it('should allow to start', function(done) {
      appswitch.start(done);
    });

    it('should not allow to stop', function() {
      assert.throws(function() {
        appswitch.stop(_.noop);
      });
    });

    it('should call all handlers in order', function(done) {
      appswitch.start(function() {
        _.each(stubs.start, function(stub) {
          assert(stub.calledOnce);
        });

        assert(_.first(stubs.start).callTime < _.last(stubs.start).callTime);

        done();
      });
    });

    it('should interrupt startup if an error occurs', function(done) {
      var error = {};
      _.first(stubs.start).callsArgWithAsync(0, error);

      appswitch.start(function(err) {
        assert.strictEqual(err, error);
        assert(!_.last(stubs.start).called);

        done();
      });
    });
  });

  context('when stopped', function() {
    beforeEach(function(done) {
      appswitch.start(done);
    });

    it('should allow to start', function(done) {
      appswitch.stop(done);
    });

    it('should not allow to stop', function() {
      assert.throws(function() {
        appswitch.start(_.noop);
      });
    });

    it('should call all handlers in order', function(done) {
      appswitch.stop(function() {
        _.each(stubs.stop, function(stub) {
          assert(stub.calledOnce);
        });

        assert(_.first(stubs.stop).callTime < _.last(stubs.stop).callTime);

        done();
      });
    });

    it('should interrupt stopping if an error occurs', function(done) {
      var error = {};
      _.first(stubs.stop).callsArgWithAsync(0, error);

      appswitch.stop(function(err) {
        assert.strictEqual(err, error);
        assert(!_.last(stubs.stop).called);

        done();
      });
    });
  });
});
