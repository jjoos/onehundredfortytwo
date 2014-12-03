!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var o;"undefined"!=typeof window?o=window:"undefined"!=typeof global?o=global:"undefined"!=typeof self&&(o=self),o.onehundredfourtytwo=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = (function() {
  function _Class(dispatcher) {
    this._dispatcher = dispatcher;
  }

  return _Class;

})();



},{}],2:[function(require,module,exports){
var Q;

Q = typeof window !== "undefined" && window !== null ? window.Q : require('q');

module.exports = (function() {
  _Class._storeClasses = [];

  _Class._actionClasses = [];

  _Class.registerStoreClass = function(storeClass) {
    return this._storeClasses.push(storeClass);
  };

  _Class.registerActionClass = function(actionClass) {
    return this._actionClasses.push(actionClass);
  };

  function _Class() {
    var action, actionClass, store, storeClass, _i, _j, _len, _len1, _ref, _ref1;
    this._callbacks = {};
    this._stores = {};
    this._actions = {};
    _ref = this.constructor._storeClasses;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      storeClass = _ref[_i];
      store = new storeClass(this);
      this._stores[store.storeName] = store;
    }
    _ref1 = this.constructor._actionClasses;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      actionClass = _ref1[_j];
      action = new actionClass(this);
      this._actions[action.actionName] = action;
    }
  }

  _Class.prototype.store = function(name) {
    return this._stores[name];
  };

  _Class.prototype.actions = function(name) {
    return this._actions[name];
  };

  _Class.prototype.addListener = function(eventName, callback, name) {
    var _base;
    (_base = this._callbacks)[eventName] || (_base[eventName] = {});
    return this._callbacks[eventName][name] = callback;
  };

  _Class.prototype.removeListener = function(eventName, callback, store) {
    var _base;
    (_base = this._callbacks)[eventName] || (_base[eventName] = {});
    return delete this._callbacks[eventName][store.storeName];
  };

  _Class.prototype.removeAllListeners = function(eventName) {
    return this._callbacks[eventName] = {};
  };

  _Class.prototype.dispatch = function(eventName, data) {
    var promise;
    promise = this.currentDispatchPromise;
    if (!promise || promise.isFulfilled()) {
      this.currentDispatchPromise = this._emitEvent(eventName, {
        data: data
      });
    } else {
      this.currentDispatchPromise.then((function(_this) {
        return function() {
          return _this._emitEvent(eventName, {
            data: data
          });
        };
      })(this));
    }
    return this.currentDispatchPromise;
  };

  _Class.prototype._emitEvent = function(eventName, payLoad) {
    var callback, name, promiseMethod, promiseMethods, promises, _fn, _ref;
    promiseMethods = {};
    promises = {};
    _ref = this._callbacks[eventName];
    _fn = function(callback, name) {
      return promiseMethods[name] = Q.fbind(function() {
        return callback(payLoad, promises);
      });
    };
    for (name in _ref) {
      callback = _ref[name];
      _fn(callback, name);
    }
    for (name in promiseMethods) {
      promiseMethod = promiseMethods[name];
      promises[name] = promiseMethod().done();
    }
    return Q.all(promises);
  };

  return _Class;

})();



},{"q":undefined}],3:[function(require,module,exports){
var Dispatcher, React;

React = typeof window !== "undefined" && window !== null ? window.React : require('react');

Dispatcher = require('./dispatcher');

module.exports = {
  childContextTypes: {
    dispatcher: React.PropTypes.object
  },
  contextTypes: {
    dispatcher: React.PropTypes.object
  },
  componentWillMount: function() {
    var componentName;
    if (this.getDispatcher() == null) {
      componentName = this.constructor.displayName || "component without display name";
      return console.error("Could not find dispatcher in @props or @context of " + componentName);
    }
  },
  getChildContext: function() {
    return {
      dispatcher: this.getDispatcher()
    };
  },
  getDispatcher: function() {
    return this.props.dispatcher || (this.context && this.context.dispatcher);
  },
  actions: function(name) {
    return this.getDispatcher().actions(name);
  },
  read: function(name) {
    return this.getDispatcher().store(name).read();
  }
};



},{"./dispatcher":2,"react":undefined}],4:[function(require,module,exports){
var Actions, Dispatcher, Helper, Store;

Dispatcher = require('./dispatcher');

Store = require('./store');

Actions = require('./actions');

Helper = require('./helper');

module.exports = {
  Dispatcher: Dispatcher,
  Store: Store,
  Actions: Actions,
  Helper: Helper
};



},{"./actions":1,"./dispatcher":2,"./helper":3,"./store":5}],5:[function(require,module,exports){
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

module.exports = (function() {
  function _Class(dispatcher) {
    this._addListener = __bind(this._addListener, this);
    this._dispatcher = dispatcher;
  }

  _Class.prototype._addListener = function(eventName, callback) {
    return this._dispatcher.addListener(eventName, callback, this.storeName);
  };

  _Class.prototype._change = function() {
    return this._dispatcher.dispatch('change');
  };

  return _Class;

})();



},{}]},{},[4])(4)
});