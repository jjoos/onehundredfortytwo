(function() {
  var Dispatcher, React;

  React = require('react');

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
    data: function(name) {
      return this.getDispatcher().store(name).data();
    }
  };

}).call(this);
