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

  read: (name) ->
    @getDispatcher().store(name).read()

  valid: (errors) ->
    validate = (errors) ->
      # http://coffeescriptcookbook.com/chapters/classes_and_objects/type-function
      type = (obj) ->
        if obj == undefined or obj == null
          return String obj
        classToType =
          '[object Boolean]': 'boolean',
          '[object Number]': 'number',
          '[object String]': 'string',
          '[object Function]': 'function',
          '[object Array]': 'array',
          '[object Date]': 'date',
          '[object RegExp]': 'regexp',
          '[object Object]': 'object'

        classToType[Object.prototype.toString.call(obj)]

      if type(errors) == 'array'
        errors.length == 0
      else if type(errors) == 'object'
        result = true
        for _key, error of errors
          result = result && validate error
        result
      else
        true

    validate errors
