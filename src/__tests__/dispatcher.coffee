jest.autoMockOff()

describe 'Dispatcher', ->
  beforeEach ->
    Dispatcher = require '../dispatcher'
    @dispatcher = new Dispatcher

  describe 'addListener', ->
    pit 'adds one listener',  ->
      eventName = 'testEvent'
      called = false
      callback = ->
        called = true

      @dispatcher.addListener eventName, callback, 'test'

      @dispatcher.dispatch(eventName).then ->
        expect(called).toBe true

    pit 'adds two listeners with different names', ->
      eventName = 'testEvent'
      called1 = false
      called2 = false
      callback1 = ->
        called1 = true
      callback2 = ->
        called2 = true

      @dispatcher.addListener eventName, callback1, 'test1'
      @dispatcher.addListener eventName, callback2, 'test2'

      @dispatcher.dispatch(eventName).catch(@fail).then ->
        expect(called1).toBe true
        expect(called2).toBe true

    pit 'overwrites listener with the same name', ->
      eventName = 'testEvent'
      called1 = false
      called2 = false
      callback1 = ->
        called1 = true
      callback2 = ->
        called2 = true

      @dispatcher.addListener eventName, callback1, 'test'
      @dispatcher.addListener eventName, callback2, 'test'

      @dispatcher.dispatch(eventName).then ->
        expect(called1).toBe false
        expect(called2).toBe true
