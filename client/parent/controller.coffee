###
	this is just a shim between the parent and controller.
	connects to the server,
	keeps event callbacks, calls them when server says to.
###

G = window

class G.Controller
	constructor: () ->
		G.socket = io.connect 'http://127.0.0.1:1338' # !!
		G.socket.emit 'log', 'connected parent'
		G.socket.emit 'parent', '', (msg) =>
			alert(msg)

		G.socket.on 'evt', (msg) =>
			@_on(msg)

		@callbacks = {}

	on: (type, callback) ->
		@callbacks[type] = callback

	_on: (evt) ->
		evt = JSON.parse(evt)
		#if we don't have a callback for that event, screw it
		if (evt.type of @callbacks) then @callbacks[evt.type](evt)