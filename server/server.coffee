###
This is super-simple! All this server does is relate the parents
and the children.

It's got a dict of parents, and a dict of children. The keys in
both are just ids - a child of a parent will have the parent's
id as its key.

When a parent emits 'regevt', its children get told to handle
whetever event type gets passed down along.
Then, whenever that event type happens on the child, the stripped
event is passed up to the parent.

When any socket emits 'log', the server will log a message. This
is for debug purposes only, and it probably shouldn't exist.

###

#super hacky way to do this, need to use modules eventually
#include cslib.js
eval(require('fs').readFileSync('../client/cslib.js')+'');

io = require('socket.io').listen(1338)

parents = {}
childs  = {}	#childs should actually be arrays of children
            	#for multiple childs per parent.

io.sockets.on 'connection', (socket) ->

	socket.on 'parent', (name, cb) ->
		console.log 'registered parent'

		#hacky, but it works. chops off the first 12 digits and
		# uses the rest as id.
		id = socket.id.toString()[12..]	#should store ints instead
		parents[id] = socket #add this socket as a parent.
		cb(id) #tell the parent what its id is.

		parents[id].on 'regevt', (type) ->
			#tell the children (once they exist) to catch [type] event
			once (-> (id of childs)), ->
				childs[id].emit 'regevt', type

	socket.on 'child', (msg, err) ->
		#if msg not of parents
			#err() #msg should be an id also in parents
			#return

		console.log 'registered child'

		childs[msg] = socket #add the socket as a child
		childs[msg].on 'evt', (evt) ->
			#console.log evt
			parents[msg].emit 'evt', evt #on event, tell parent.

	socket.on 'log', (msg) ->
		console.log msg