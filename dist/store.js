(function() {
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

}).call(this);
