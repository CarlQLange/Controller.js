G = window

drawDot = (x, y, cnv=G.mainCanvas) ->
	cnv.beginPath()
	cnv.moveTo x, y
	cnv.lineTo x+2, y+2
	cnv.closePath()
	cnv.stroke()

$ ->
	$("#cnv").attr('width', window.innerWidth)
	$("#cnv").attr('height', window.innerHeight)
	G.mainCanvas = document.getElementById("cnv").getContext('2d')
	G.mainCanvas.strokeStyle = "#F00"

	iPhone = new Controller()

	iPhone.on 'mousemove', (evt) ->
		drawDot(evt.x, evt.y)

	iPhone.on 'mousedown', (evt) ->
		drawDot(evt.x, evt.y)

	iPhone.on 'touchmove', (evt) ->
		drawDot(evt.x, evt.y)