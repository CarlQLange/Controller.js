###
	this is just a shim between the parent and controller.
	connects to the server,
	keeps event callbacks, calls them when server says to.
###

G = window

class G.Controller
	constructor: (server='http://127.0.0.1:1338') ->
		G.socket = io.connect server # !!
		G.socket.emit 'log', 'connected parent'
		G.socket.emit 'parent', '', (msg) =>
			@id = msg
			#I really need to sort out a nicer way
			# to connect controllers...
			alert(@id)

		G.socket.on 'evt', (msg) =>
			@_on(msg)

		@callbacks = {}

	on: (type, callback) ->
		@callbacks[type] = callback
		G.socket.emit 'regevt', type

	_on: (evt) ->
		#console.log evt
		#try
			evt = JSON.parse(evt)
			#if we don't have a callback for that event, screw it
			if (evt.type of @callbacks) then @callbacks[evt.type](evt)
		#catch error
		#	console.log("""
		#		Couldn't parse event. stripevent didn't work properly!
		#	""")
		#	G.socket.emit 'log', "Couldn't parse event."