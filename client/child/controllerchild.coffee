### controllerchild.coffee ###

G = window

$ ->
	$("#cnv").attr('width', window.innerWidth)
	$("#cnv").attr('height', window.innerHeight)

	parentid = document.URL.split("?id=")[1].split("/")[0] #bad? oh well.

	G.socket = io.connect 'http://127.0.0.1:1338' # !!
	#G.socket.emit 'log', 'connected child'
	G.socket.emit 'child', parentid
	
	$("#cnv").on 'mousedown', (evt) ->
		#G.socket.emit 'log', 'mousedown on child'
		
		evtsend = {
			x: evt.offsetX,
			y: evt.offsetY,
			type: 'mousedown'
		}
		
		G.socket.emit 'evt', evtsend

	$("#cnv").on 'mousemove', (evt) ->
		#G.socket.emit 'log', 'mousemove on child'
		evtsend = {
			x: evt.offsetX,
			y: evt.offsetY,
			type: 'mousemove'
		}
		
		G.socket.emit 'evt', evtsend

	$("#cnv").on 'touchmove', (evt) ->
		#G.socket.emit 'log', 'touchmove on child'
		event.preventDefault() #stop rubber-band scrolling on iOS
		if evt.originalEvent.touches.length == 1
			touch = evt.originalEvent.touches[0]
			evtsend = {
				x: touch.pageX,
				y: touch.pageY,
				type: 'touchmove'
			}

			G.socket.emit 'evt', evtsend

# this is a function to strip event object of cyclical refs and functions
# so that it jsonifies well.

stripevent = (evt) ->
	