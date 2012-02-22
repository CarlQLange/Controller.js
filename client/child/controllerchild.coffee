### controllerchild.coffee ###

G = window

$ ->
	G.socket = io.connect 'http://169.254.138.118:1338' # !!

	$('#enterid').click (evt) ->
		$('#enterid').fadeOut()
		$('#idinput').fadeOut()
		run $('#idinput').val()


run = (parentid) ->
	console.log parentid

	G.socket.emit 'child', parentid

	G.socket.on 'regevt', (evtname) ->
		#add a handler for that event.
		#should this be on cnv or on window?
		console.log $(window)
		$(window).on evtname, (evt) ->
			console.log evt
			G.socket.emit 'evt', stripevent(evt)

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
		#also coffeescript, you seriously need to fix the
		# bug that makes me split this if across multiple lines in an ugly way 
		if (typeof(value) != 'function' and !key.endsWith('Element') and 
		!key.endsWith('arget') and key != 'view')
			ret[key] = value
	JSON.stringify ret