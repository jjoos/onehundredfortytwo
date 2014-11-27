(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = (function() {
  function _Class(dispatcher) {
    this._dispatcher = dispatcher;
  }

  return _Class;

})();



},{}],2:[function(require,module,exports){
var Q;

Q = require('q');

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

React = require('react');

Dispatcher = require('./dispatcher.coffee');

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
  data: function(name) {
    return this.getDispatcher().store(name).data();
  }
};



},{"./dispatcher.coffee":2,"react":undefined}],4:[function(require,module,exports){
var Actions, Dispatcher, DispatcherHelper, Q, React, Store;

Q = require('q');

React = require('react');

Dispatcher = require('./dispatcher.coffee');

DispatcherHelper = require('./dispatcher_helper.coffee');

Store = require('./store.coffee');

Actions = require('./actions.coffee');

module.exports = {
  Dispatcher: Dispatcher,
  Store: Store,
  Actions: Actions,
  DispatcherHelper: DispatcherHelper,
  React: React,
  Q: Q
};



},{"./actions.coffee":1,"./dispatcher.coffee":2,"./dispatcher_helper.coffee":3,"./store.coffee":5,"q":undefined,"react":undefined}],5:[function(require,module,exports){
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



},{}]},{},[4])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvampvb3MvZGV2L29uZWh1bmRyZWRmb3VydHl0d28vc3JjL2FjdGlvbnMuY29mZmVlIiwiL1VzZXJzL2pqb29zL2Rldi9vbmVodW5kcmVkZm91cnR5dHdvL3NyYy9kaXNwYXRjaGVyLmNvZmZlZSIsIi9Vc2Vycy9qam9vcy9kZXYvb25laHVuZHJlZGZvdXJ0eXR3by9zcmMvZGlzcGF0Y2hlcl9oZWxwZXIuY29mZmVlIiwiL1VzZXJzL2pqb29zL2Rldi9vbmVodW5kcmVkZm91cnR5dHdvL3NyYy9vbmVodW5kcmVkZm91cnR5dHdvLmNvZmZlZSIsIi9Vc2Vycy9qam9vcy9kZXYvb25laHVuZHJlZGZvdXJ0eXR3by9zcmMvc3RvcmUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsTUFBTSxDQUFDLE9BQVA7QUFDZSxFQUFBLGdCQUFDLFVBQUQsR0FBQTtBQUNYLElBQUEsSUFBQyxDQUFBLFdBQUQsR0FBZSxVQUFmLENBRFc7RUFBQSxDQUFiOztnQkFBQTs7SUFERixDQUFBOzs7OztBQ0FBLElBQUEsQ0FBQTs7QUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLEdBQVIsQ0FBSixDQUFBOztBQUFBLE1BRU0sQ0FBQyxPQUFQO0FBQ0UsRUFBQSxNQUFDLENBQUEsYUFBRCxHQUFnQixFQUFoQixDQUFBOztBQUFBLEVBQ0EsTUFBQyxDQUFBLGNBQUQsR0FBaUIsRUFEakIsQ0FBQTs7QUFBQSxFQUdBLE1BQUMsQ0FBQSxrQkFBRCxHQUFxQixTQUFDLFVBQUQsR0FBQTtXQUNuQixJQUFDLENBQUEsYUFBYSxDQUFDLElBQWYsQ0FBb0IsVUFBcEIsRUFEbUI7RUFBQSxDQUhyQixDQUFBOztBQUFBLEVBTUEsTUFBQyxDQUFBLG1CQUFELEdBQXNCLFNBQUMsV0FBRCxHQUFBO1dBQ3BCLElBQUMsQ0FBQSxjQUFjLENBQUMsSUFBaEIsQ0FBcUIsV0FBckIsRUFEb0I7RUFBQSxDQU50QixDQUFBOztBQVNhLEVBQUEsZ0JBQUEsR0FBQTtBQUNYLFFBQUEsd0VBQUE7QUFBQSxJQUFBLElBQUMsQ0FBQSxVQUFELEdBQWMsRUFBZCxDQUFBO0FBQUEsSUFDQSxJQUFDLENBQUEsT0FBRCxHQUFXLEVBRFgsQ0FBQTtBQUFBLElBRUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxFQUZaLENBQUE7QUFHQTtBQUFBLFNBQUEsMkNBQUE7NEJBQUE7QUFDRSxNQUFBLEtBQUEsR0FBWSxJQUFBLFVBQUEsQ0FBVyxJQUFYLENBQVosQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE9BQVEsQ0FBQSxLQUFLLENBQUMsU0FBTixDQUFULEdBQTRCLEtBRDVCLENBREY7QUFBQSxLQUhBO0FBT0E7QUFBQSxTQUFBLDhDQUFBOzhCQUFBO0FBQ0UsTUFBQSxNQUFBLEdBQWEsSUFBQSxXQUFBLENBQVksSUFBWixDQUFiLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxRQUFTLENBQUEsTUFBTSxDQUFDLFVBQVAsQ0FBVixHQUErQixNQUQvQixDQURGO0FBQUEsS0FSVztFQUFBLENBVGI7O0FBQUEsbUJBcUJBLEtBQUEsR0FBTyxTQUFDLElBQUQsR0FBQTtXQUNMLElBQUMsQ0FBQSxPQUFRLENBQUEsSUFBQSxFQURKO0VBQUEsQ0FyQlAsQ0FBQTs7QUFBQSxtQkF3QkEsT0FBQSxHQUFTLFNBQUMsSUFBRCxHQUFBO1dBQ1AsSUFBQyxDQUFBLFFBQVMsQ0FBQSxJQUFBLEVBREg7RUFBQSxDQXhCVCxDQUFBOztBQUFBLG1CQTJCQSxXQUFBLEdBQWEsU0FBQyxTQUFELEVBQVksUUFBWixFQUFzQixJQUF0QixHQUFBO0FBQ1gsUUFBQSxLQUFBO0FBQUEsYUFBQSxJQUFDLENBQUEsV0FBVyxDQUFBLFNBQUEsV0FBQSxDQUFBLFNBQUEsSUFBZSxHQUEzQixDQUFBO1dBQ0EsSUFBQyxDQUFBLFVBQVcsQ0FBQSxTQUFBLENBQVcsQ0FBQSxJQUFBLENBQXZCLEdBQStCLFNBRnBCO0VBQUEsQ0EzQmIsQ0FBQTs7QUFBQSxtQkErQkEsY0FBQSxHQUFnQixTQUFDLFNBQUQsRUFBWSxRQUFaLEVBQXNCLEtBQXRCLEdBQUE7QUFDZCxRQUFBLEtBQUE7QUFBQSxhQUFBLElBQUMsQ0FBQSxXQUFXLENBQUEsU0FBQSxXQUFBLENBQUEsU0FBQSxJQUFlLEdBQTNCLENBQUE7V0FDQSxNQUFBLENBQUEsSUFBUSxDQUFBLFVBQVcsQ0FBQSxTQUFBLENBQVcsQ0FBQSxLQUFLLENBQUMsU0FBTixFQUZoQjtFQUFBLENBL0JoQixDQUFBOztBQUFBLG1CQW1DQSxrQkFBQSxHQUFvQixTQUFDLFNBQUQsR0FBQTtXQUNsQixJQUFDLENBQUEsVUFBVyxDQUFBLFNBQUEsQ0FBWixHQUF5QixHQURQO0VBQUEsQ0FuQ3BCLENBQUE7O0FBQUEsbUJBc0NBLFFBQUEsR0FBVSxTQUFDLFNBQUQsRUFBWSxJQUFaLEdBQUE7QUFDUixRQUFBLE9BQUE7QUFBQSxJQUFBLE9BQUEsR0FBVSxJQUFDLENBQUEsc0JBQVgsQ0FBQTtBQUNBLElBQUEsSUFBRyxDQUFBLE9BQUEsSUFBWSxPQUFPLENBQUMsV0FBUixDQUFBLENBQWY7QUFDRSxNQUFBLElBQUMsQ0FBQSxzQkFBRCxHQUEwQixJQUFDLENBQUEsVUFBRCxDQUFZLFNBQVosRUFBdUI7QUFBQSxRQUFBLElBQUEsRUFBTSxJQUFOO09BQXZCLENBQTFCLENBREY7S0FBQSxNQUFBO0FBR0UsTUFBQSxJQUFDLENBQUEsc0JBQXNCLENBQUMsSUFBeEIsQ0FBNkIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDM0IsS0FBQyxDQUFBLFVBQUQsQ0FBWSxTQUFaLEVBQXVCO0FBQUEsWUFBQSxJQUFBLEVBQU0sSUFBTjtXQUF2QixFQUQyQjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTdCLENBQUEsQ0FIRjtLQURBO1dBT0EsSUFBQyxDQUFBLHVCQVJPO0VBQUEsQ0F0Q1YsQ0FBQTs7QUFBQSxtQkFnREEsVUFBQSxHQUFZLFNBQUMsU0FBRCxFQUFZLE9BQVosR0FBQTtBQUNWLFFBQUEsa0VBQUE7QUFBQSxJQUFBLGNBQUEsR0FBaUIsRUFBakIsQ0FBQTtBQUFBLElBQ0EsUUFBQSxHQUFXLEVBRFgsQ0FBQTtBQUVBO0FBQUEsVUFDSyxTQUFDLFFBQUQsRUFBVyxJQUFYLEdBQUE7YUFDRCxjQUFlLENBQUEsSUFBQSxDQUFmLEdBQ0UsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxTQUFBLEdBQUE7ZUFBRyxRQUFBLENBQVMsT0FBVCxFQUFrQixRQUFsQixFQUFIO01BQUEsQ0FBUixFQUZEO0lBQUEsQ0FETDtBQUFBLFNBQUEsWUFBQTs0QkFBQTtBQUNFLFVBQUksVUFBVSxLQUFkLENBREY7QUFBQSxLQUZBO0FBT0EsU0FBQSxzQkFBQTsyQ0FBQTtBQUNFLE1BQUEsUUFBUyxDQUFBLElBQUEsQ0FBVCxHQUFpQixhQUFBLENBQUEsQ0FBZSxDQUFDLElBQWhCLENBQUEsQ0FBakIsQ0FERjtBQUFBLEtBUEE7V0FVQSxDQUFDLENBQUMsR0FBRixDQUFNLFFBQU4sRUFYVTtFQUFBLENBaERaLENBQUE7O2dCQUFBOztJQUhGLENBQUE7Ozs7O0FDQUEsSUFBQSxpQkFBQTs7QUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLE9BQVIsQ0FBUixDQUFBOztBQUFBLFVBRUEsR0FBYSxPQUFBLENBQVEscUJBQVIsQ0FGYixDQUFBOztBQUFBLE1BSU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxFQUFBLGlCQUFBLEVBR0U7QUFBQSxJQUFBLFVBQUEsRUFBWSxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQTVCO0dBSEY7QUFBQSxFQUtBLFlBQUEsRUFHRTtBQUFBLElBQUEsVUFBQSxFQUFZLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBNUI7R0FSRjtBQUFBLEVBVUEsa0JBQUEsRUFBb0IsU0FBQSxHQUFBO0FBQ2xCLFFBQUEsYUFBQTtBQUFBLElBQUEsSUFBTyw0QkFBUDtBQUNFLE1BQUEsYUFBQSxHQUFnQixJQUFDLENBQUEsV0FBVyxDQUFDLFdBQWIsSUFBNEIsZ0NBQTVDLENBQUE7YUFDQSxPQUFPLENBQUMsS0FBUixDQUFlLHFEQUFBLEdBQXFELGFBQXBFLEVBRkY7S0FEa0I7RUFBQSxDQVZwQjtBQUFBLEVBZUEsZUFBQSxFQUFpQixTQUFBLEdBQUE7V0FDZjtBQUFBLE1BQUEsVUFBQSxFQUFZLElBQUMsQ0FBQSxhQUFELENBQUEsQ0FBWjtNQURlO0VBQUEsQ0FmakI7QUFBQSxFQWtCQSxhQUFBLEVBQWUsU0FBQSxHQUFBO1dBQ2IsSUFBQyxDQUFBLEtBQUssQ0FBQyxVQUFQLElBQXFCLENBQUMsSUFBQyxDQUFBLE9BQUQsSUFBWSxJQUFDLENBQUEsT0FBTyxDQUFDLFVBQXRCLEVBRFI7RUFBQSxDQWxCZjtBQUFBLEVBcUJBLE9BQUEsRUFBUyxTQUFDLElBQUQsR0FBQTtXQUNQLElBQUMsQ0FBQSxhQUFELENBQUEsQ0FBZ0IsQ0FBQyxPQUFqQixDQUF5QixJQUF6QixFQURPO0VBQUEsQ0FyQlQ7QUFBQSxFQXdCQSxJQUFBLEVBQU0sU0FBQyxJQUFELEdBQUE7V0FDSixJQUFDLENBQUEsYUFBRCxDQUFBLENBQWdCLENBQUMsS0FBakIsQ0FBdUIsSUFBdkIsQ0FBNEIsQ0FBQyxJQUE3QixDQUFBLEVBREk7RUFBQSxDQXhCTjtDQUxGLENBQUE7Ozs7O0FDQUEsSUFBQSxzREFBQTs7QUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLEdBQVIsQ0FBSixDQUFBOztBQUFBLEtBQ0EsR0FBUSxPQUFBLENBQVEsT0FBUixDQURSLENBQUE7O0FBQUEsVUFHQSxHQUFhLE9BQUEsQ0FBUSxxQkFBUixDQUhiLENBQUE7O0FBQUEsZ0JBSUEsR0FBbUIsT0FBQSxDQUFRLDRCQUFSLENBSm5CLENBQUE7O0FBQUEsS0FLQSxHQUFRLE9BQUEsQ0FBUSxnQkFBUixDQUxSLENBQUE7O0FBQUEsT0FNQSxHQUFVLE9BQUEsQ0FBUSxrQkFBUixDQU5WLENBQUE7O0FBQUEsTUFRTSxDQUFDLE9BQVAsR0FDRTtBQUFBLEVBQUEsVUFBQSxFQUFZLFVBQVo7QUFBQSxFQUNBLEtBQUEsRUFBTyxLQURQO0FBQUEsRUFFQSxPQUFBLEVBQVMsT0FGVDtBQUFBLEVBR0EsZ0JBQUEsRUFBa0IsZ0JBSGxCO0FBQUEsRUFJQSxLQUFBLEVBQU8sS0FKUDtBQUFBLEVBS0EsQ0FBQSxFQUFHLENBTEg7Q0FURixDQUFBOzs7OztBQ0FBLElBQUEsa0ZBQUE7O0FBQUEsTUFBTSxDQUFDLE9BQVA7QUFDZSxFQUFBLGdCQUFDLFVBQUQsR0FBQTtBQUNYLHVEQUFBLENBQUE7QUFBQSxJQUFBLElBQUMsQ0FBQSxXQUFELEdBQWUsVUFBZixDQURXO0VBQUEsQ0FBYjs7QUFBQSxtQkFHQSxZQUFBLEdBQWMsU0FBQyxTQUFELEVBQVksUUFBWixHQUFBO1dBQ1osSUFBQyxDQUFBLFdBQVcsQ0FBQyxXQUFiLENBQXlCLFNBQXpCLEVBQW9DLFFBQXBDLEVBQThDLElBQUMsQ0FBQSxTQUEvQyxFQURZO0VBQUEsQ0FIZCxDQUFBOztBQUFBLG1CQU1BLE9BQUEsR0FBUyxTQUFBLEdBQUE7V0FDUCxJQUFDLENBQUEsV0FBVyxDQUFDLFFBQWIsQ0FBc0IsUUFBdEIsRUFETztFQUFBLENBTlQsQ0FBQTs7Z0JBQUE7O0lBREYsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IGNsYXNzXG4gIGNvbnN0cnVjdG9yOiAoZGlzcGF0Y2hlcikgLT5cbiAgICBAX2Rpc3BhdGNoZXIgPSBkaXNwYXRjaGVyXG4iLCJRID0gcmVxdWlyZSAncSdcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzc1xuICBAX3N0b3JlQ2xhc3NlczogW11cbiAgQF9hY3Rpb25DbGFzc2VzOiBbXVxuXG4gIEByZWdpc3RlclN0b3JlQ2xhc3M6IChzdG9yZUNsYXNzKSAtPlxuICAgIEBfc3RvcmVDbGFzc2VzLnB1c2ggc3RvcmVDbGFzc1xuXG4gIEByZWdpc3RlckFjdGlvbkNsYXNzOiAoYWN0aW9uQ2xhc3MpIC0+XG4gICAgQF9hY3Rpb25DbGFzc2VzLnB1c2ggYWN0aW9uQ2xhc3NcblxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBAX2NhbGxiYWNrcyA9IHt9XG4gICAgQF9zdG9yZXMgPSB7fVxuICAgIEBfYWN0aW9ucyA9IHt9XG4gICAgZm9yIHN0b3JlQ2xhc3MgaW4gQGNvbnN0cnVjdG9yLl9zdG9yZUNsYXNzZXNcbiAgICAgIHN0b3JlID0gbmV3IHN0b3JlQ2xhc3MgQFxuICAgICAgQF9zdG9yZXNbc3RvcmUuc3RvcmVOYW1lXSA9IHN0b3JlXG5cbiAgICBmb3IgYWN0aW9uQ2xhc3MgaW4gQGNvbnN0cnVjdG9yLl9hY3Rpb25DbGFzc2VzXG4gICAgICBhY3Rpb24gPSBuZXcgYWN0aW9uQ2xhc3MgQFxuICAgICAgQF9hY3Rpb25zW2FjdGlvbi5hY3Rpb25OYW1lXSA9IGFjdGlvblxuXG4gIHN0b3JlOiAobmFtZSkgLT5cbiAgICBAX3N0b3Jlc1tuYW1lXVxuXG4gIGFjdGlvbnM6IChuYW1lKSAtPlxuICAgIEBfYWN0aW9uc1tuYW1lXVxuXG4gIGFkZExpc3RlbmVyOiAoZXZlbnROYW1lLCBjYWxsYmFjaywgbmFtZSkgLT5cbiAgICBAX2NhbGxiYWNrc1tldmVudE5hbWVdIHx8PSB7fVxuICAgIEBfY2FsbGJhY2tzW2V2ZW50TmFtZV1bbmFtZV0gPSBjYWxsYmFja1xuXG4gIHJlbW92ZUxpc3RlbmVyOiAoZXZlbnROYW1lLCBjYWxsYmFjaywgc3RvcmUpIC0+XG4gICAgQF9jYWxsYmFja3NbZXZlbnROYW1lXSB8fD0ge31cbiAgICBkZWxldGUgQF9jYWxsYmFja3NbZXZlbnROYW1lXVtzdG9yZS5zdG9yZU5hbWVdXG5cbiAgcmVtb3ZlQWxsTGlzdGVuZXJzOiAoZXZlbnROYW1lKSAtPlxuICAgIEBfY2FsbGJhY2tzW2V2ZW50TmFtZV0gPSB7fVxuXG4gIGRpc3BhdGNoOiAoZXZlbnROYW1lLCBkYXRhKSAtPlxuICAgIHByb21pc2UgPSBAY3VycmVudERpc3BhdGNoUHJvbWlzZVxuICAgIGlmICFwcm9taXNlIHx8IHByb21pc2UuaXNGdWxmaWxsZWQoKVxuICAgICAgQGN1cnJlbnREaXNwYXRjaFByb21pc2UgPSBAX2VtaXRFdmVudCBldmVudE5hbWUsIGRhdGE6IGRhdGFcbiAgICBlbHNlXG4gICAgICBAY3VycmVudERpc3BhdGNoUHJvbWlzZS50aGVuID0+XG4gICAgICAgIEBfZW1pdEV2ZW50IGV2ZW50TmFtZSwgZGF0YTogZGF0YVxuXG4gICAgQGN1cnJlbnREaXNwYXRjaFByb21pc2VcblxuICBfZW1pdEV2ZW50OiAoZXZlbnROYW1lLCBwYXlMb2FkKSAtPlxuICAgIHByb21pc2VNZXRob2RzID0ge31cbiAgICBwcm9taXNlcyA9IHt9XG4gICAgZm9yIG5hbWUsIGNhbGxiYWNrIG9mIEBfY2FsbGJhY2tzW2V2ZW50TmFtZV1cbiAgICAgIGRvIChjYWxsYmFjaywgbmFtZSkgLT5cbiAgICAgICAgcHJvbWlzZU1ldGhvZHNbbmFtZV0gPVxuICAgICAgICAgIFEuZmJpbmQgLT4gY2FsbGJhY2sgcGF5TG9hZCwgcHJvbWlzZXNcblxuICAgIGZvciBuYW1lLCBwcm9taXNlTWV0aG9kIG9mIHByb21pc2VNZXRob2RzXG4gICAgICBwcm9taXNlc1tuYW1lXSA9IHByb21pc2VNZXRob2QoKS5kb25lKClcblxuICAgIFEuYWxsKHByb21pc2VzKVxuIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdCdcblxuRGlzcGF0Y2hlciA9IHJlcXVpcmUgJy4vZGlzcGF0Y2hlci5jb2ZmZWUnXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgY2hpbGRDb250ZXh0VHlwZXM6XG4gICAgIyBUT0RPOiBDYW5ub3QgbWFrZSB0aGlzOiBgUmVhY3QuUHJvcFR5cGVzLmluc3RhbmNlT2YoRGlzcGF0Y2hlcilgXG4gICAgIyBpbnZlc3RpZ2F0ZSB0aGlzLiBodHRwOi8vZmFjZWJvb2suZ2l0aHViLmlvL3JlYWN0L2RvY3MvcmV1c2FibGUtY29tcG9uZW50cy5odG1sXG4gICAgZGlzcGF0Y2hlcjogUmVhY3QuUHJvcFR5cGVzLm9iamVjdFxuXG4gIGNvbnRleHRUeXBlczpcbiAgICAjIFRPRE86IENhbm5vdCBtYWtlIHRoaXM6IGBSZWFjdC5Qcm9wVHlwZXMuaW5zdGFuY2VPZihEaXNwYXRjaGVyKWBcbiAgICAjIGludmVzdGlnYXRlIHRoaXMuIGh0dHA6Ly9mYWNlYm9vay5naXRodWIuaW8vcmVhY3QvZG9jcy9yZXVzYWJsZS1jb21wb25lbnRzLmh0bWxcbiAgICBkaXNwYXRjaGVyOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0XG5cbiAgY29tcG9uZW50V2lsbE1vdW50OiAtPlxuICAgIHVubGVzcyBAZ2V0RGlzcGF0Y2hlcigpP1xuICAgICAgY29tcG9uZW50TmFtZSA9IEBjb25zdHJ1Y3Rvci5kaXNwbGF5TmFtZSB8fCBcImNvbXBvbmVudCB3aXRob3V0IGRpc3BsYXkgbmFtZVwiXG4gICAgICBjb25zb2xlLmVycm9yIFwiQ291bGQgbm90IGZpbmQgZGlzcGF0Y2hlciBpbiBAcHJvcHMgb3IgQGNvbnRleHQgb2YgI3tjb21wb25lbnROYW1lfVwiXG5cbiAgZ2V0Q2hpbGRDb250ZXh0OiAtPlxuICAgIGRpc3BhdGNoZXI6IEBnZXREaXNwYXRjaGVyKClcblxuICBnZXREaXNwYXRjaGVyOiAtPlxuICAgIEBwcm9wcy5kaXNwYXRjaGVyIHx8IChAY29udGV4dCAmJiBAY29udGV4dC5kaXNwYXRjaGVyKVxuXG4gIGFjdGlvbnM6IChuYW1lKSAtPlxuICAgIEBnZXREaXNwYXRjaGVyKCkuYWN0aW9ucyhuYW1lKVxuXG4gIGRhdGE6IChuYW1lKSAtPlxuICAgIEBnZXREaXNwYXRjaGVyKCkuc3RvcmUobmFtZSkuZGF0YSgpXG4iLCJRID0gcmVxdWlyZSAncSdcblJlYWN0ID0gcmVxdWlyZSAncmVhY3QnXG5cbkRpc3BhdGNoZXIgPSByZXF1aXJlICcuL2Rpc3BhdGNoZXIuY29mZmVlJ1xuRGlzcGF0Y2hlckhlbHBlciA9IHJlcXVpcmUgJy4vZGlzcGF0Y2hlcl9oZWxwZXIuY29mZmVlJ1xuU3RvcmUgPSByZXF1aXJlICcuL3N0b3JlLmNvZmZlZSdcbkFjdGlvbnMgPSByZXF1aXJlICcuL2FjdGlvbnMuY29mZmVlJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIERpc3BhdGNoZXI6IERpc3BhdGNoZXJcbiAgU3RvcmU6IFN0b3JlXG4gIEFjdGlvbnM6IEFjdGlvbnNcbiAgRGlzcGF0Y2hlckhlbHBlcjogRGlzcGF0Y2hlckhlbHBlclxuICBSZWFjdDogUmVhY3RcbiAgUTogUVxuIiwibW9kdWxlLmV4cG9ydHMgPSBjbGFzc1xuICBjb25zdHJ1Y3RvcjogKGRpc3BhdGNoZXIpIC0+XG4gICAgQF9kaXNwYXRjaGVyID0gZGlzcGF0Y2hlclxuXG4gIF9hZGRMaXN0ZW5lcjogKGV2ZW50TmFtZSwgY2FsbGJhY2spID0+XG4gICAgQF9kaXNwYXRjaGVyLmFkZExpc3RlbmVyIGV2ZW50TmFtZSwgY2FsbGJhY2ssIEBzdG9yZU5hbWVcblxuICBfY2hhbmdlOiAtPlxuICAgIEBfZGlzcGF0Y2hlci5kaXNwYXRjaCAnY2hhbmdlJ1xuIl19
