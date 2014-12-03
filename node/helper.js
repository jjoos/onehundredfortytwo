(function() {
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
    },
    valid: function(errors) {
      var error, result, type, _key;
      type = function(obj) {
        var classToType;
        if (obj === void 0 || obj === null) {
          return String(obj);
        }
        classToType = {
          '[object Boolean]': 'boolean',
          '[object Number]': 'number',
          '[object String]': 'string',
          '[object Function]': 'function',
          '[object Array]': 'array',
          '[object Date]': 'date',
          '[object RegExp]': 'regexp',
          '[object Object]': 'object'
        };
        return classToType[Object.prototype.toString.call(obj)];
      };
      if (type(errors) === 'array') {
        return errors.length === 0;
      } else if (type(errors) === 'object') {
        result = true;
        for (_key in errors) {
          error = errors[_key];
          result = result && this.valid(error);
        }
        return result;
      } else {
        return true;
      }
    }
  };

}).call(this);
