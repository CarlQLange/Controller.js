### controllerchild.coffee ###

G = window

$ ->
	$("#cnv").attr('width', window.innerWidth)
	$("#cnv").attr('height', window.innerHeight)

	parentid = document.URL.split("?id=")[1].split("/")[0] #bad? oh well.

	G.socket = io.connect 'http://127.0.0.1:1338' # !!
	#G.socket.emit 'log', 'connected child'
	G.socket.emit 'child', parentid
	
	## need to replace these by getting the server
	## to tell the child what events to send up.
	$("#cnv").on 'mousedown', (evt) ->
		G.socket.emit 'evt', stripevent evt

	$("#cnv").on 'mousemove', (evt) ->
		G.socket.emit 'evt', stripevent evt

	$("#cnv").on 'touchmove', (evt) ->
		G.socket.emit 'evt', stripevent evt

	# I suspect this doesn't work but I can't check it right now
	$("#cnv").on 'ondevicemotion', (evt) ->
		G.socket.emit 'evt', stripevent

# this is a function to strip event object of cyclical refs and functions
# so that it jsonifies well.
# This way I can just send up the events, without the references to the
# window etc. Means I dont need to basically write my own events.
# Though maybe a lightweight version doesn't need to use this and just
# the most common bits of the events (coords for example)
stripevent = (evt) ->
	ret = {}
	for key, value of evt.originalEvent
		# "No, this isn't _nearly_ hacky enough!!"
		if typeof(value) != 'function' and !key.endsWith('Element') and !key.endsWith('arget') and key != 'view'
			ret[key] = value
	JSON.stringify ret
