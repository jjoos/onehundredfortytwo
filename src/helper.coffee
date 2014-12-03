React = if window? then window.React else require 'react'

Dispatcher = require './dispatcher'

module.exports =
  childContextTypes:
    # TODO: Cannot make this: `React.PropTypes.instanceOf(Dispatcher)`
    # investigate this. http://facebook.github.io/react/docs/reusable-components.html
    dispatcher: React.PropTypes.object

  contextTypes:
    # TODO: Cannot make this: `React.PropTypes.instanceOf(Dispatcher)`
    # investigate this. http://facebook.github.io/react/docs/reusable-components.html
    dispatcher: React.PropTypes.object

  componentWillMount: ->
    unless @getDispatcher()?
      componentName = @constructor.displayName || "component without display name"
      console.error "Could not find dispatcher in @props or @context of #{componentName}"

  getChildContext: ->
    dispatcher: @getDispatcher()

  getDispatcher: ->
    @props.dispatcher || (@context && @context.dispatcher)

  actions: (name) ->
    @getDispatcher().actions(name)

  data: (name) ->
    @getDispatcher().store(name).data()
