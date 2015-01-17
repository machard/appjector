'use strict';

function MockToken(fn, name) {

  this.original = fn;
  this.isConstructor = false;
  this.name = name || fn.name;
}

MockToken.getConstructorToken = function(fn, name) {
  var token = new MockToken(fn, name);
  token.isConstructor = true;

  return token;
};

module.exports = MockToken;
