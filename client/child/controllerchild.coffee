### controllerchild.coffee ###

G = window

window.onload = () ->
	G.socket = io.connect 'http://127.0.0.1:1338' # !!

	enterbutton = document.querySelector('#enterid')
	textfield = document.querySelector('#idinput')
	enterbutton.addEventListener 'click', (evt) ->
		if (textfield.value)
			enterbutton.style.display = 'none'
			textfield.style.display = 'none'
			run textfield.value


run = (parentid) ->
	console.log parentid

	G.socket.emit 'child', parentid

	G.socket.on 'regevt', (evtname) ->
		#add a handler for that event.
		#should this be on cnv or on window?
		document.addEventListener evtname, (evt) ->
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