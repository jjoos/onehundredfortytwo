(function() {
  var Actions, Dispatcher, Helper, Store;

  Dispatcher =  (function() {
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

  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Store = (function() {
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

  Actions =  (function() {
    function _Class(dispatcher) {
      this._dispatcher = dispatcher;
    }

    return _Class;

  })();

  Helper =  {
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

  window.onehundredfourytwo = {
    Dispatcher: Dispatcher,
    Store: Store,
    Actions: Actions,
    Helper: Helper
  };

}).call(this);
