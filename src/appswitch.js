'use strict';

/**
 * An AppSwitch is an utility that allows to add async start/stop handlers and to execute them in order
 * @class
 * @alias appjector.AppSwitch
 */
function AppSwitch() {
  this.onStartHandlers = [];
  this.onStopHandlers = [];
  this.started = false;
}

/**
 * Iterates over the handlers in series
 * @param {appjector.AppSwitch~startStopHandler[]} handlers
 * @param {appjector.AppSwitch~startStopCallback} callback
 * @private
*/
function iterate(handlers, callback) {
  if (!handlers.length) {
    return callback();
  }

  handlers[0](function(err) {
    if (err) {
      return callback(err);
    }

    iterate(handlers.slice(1), callback);
  });
}

/**
 * Add a start handler
 * @param {appjector.AppSwitch~startStopHandler} callback
*/
AppSwitch.prototype.onStart = function(handler) {
  this.onStartHandlers.push(handler);
};

/**
 * Add a stop handler
 * @param {appjector.AppSwitch~startStopHandler} callback
*/
AppSwitch.prototype.onStop = function(handler) {
  this.onStopHandlers.push(handler);
};

/**
 * Execute the stop handlers
 * @param {appjector.AppSwitch~startStopCallback} callback
*/
AppSwitch.prototype.stop = function(callback) {
  var self = this;

  if (!this.started) {
    throw new Error('Already stopped');
  }

  iterate(this.onStopHandlers, function(err) {
    if (err) {
      return callback(err);
    }

    self.started = false;

    callback();
  });
};

/**
 * Execute the start handlers
 * @param {appjector.AppSwitch~startStopCallback} callback
*/
AppSwitch.prototype.start = function(callback) {
  var self = this;

  if (self.started) {
    throw new Error('Already started');
  }
  iterate(this.onStartHandlers, function(err) {
    if (err) {
      return callback(err);
    }

    self.started = true;

    callback();
  });
};

/**
 * This define the format of start/stop handlers
 *
 * @typedef {Function} appjector.AppSwitch~startStopHandler
 * @param {object} [err] an error that happened
*/

/**
 * This define the format of start/stop callbacks
 *
 * @callback appjector.AppSwitch~startStopCallback
 * @param {object} [err] an error that happened
*/

module.exports = AppSwitch;
