io = require('socket.io').listen(1338)

parent = child = null

parents = {}
childs  = {}

io.sockets.on 'connection', (socket) ->

	socket.on 'parent', (name, cb) ->
		console.log 'registered parent'
		parents[(socket.id.toString())[12..]] = socket
		cb((socket.id.toString())[12..])

	socket.on 'child', (msg) ->
		console.log 'registered child'
		childs[msg] = socket
		childs[msg].on 'evt', (evt) ->
			parents[msg].emit 'evt', evt

	socket.on 'log', (msg) ->
		console.log msg