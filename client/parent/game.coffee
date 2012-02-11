G = window

###
drawDot = (x, y, cnv=G.mainCanvas) ->
	cnv.beginPath()
	cnv.moveTo x, y
	cnv.lineTo x+2, y+2
	cnv.closePath()
	cnv.stroke()
###

G.gravity = {
	x:0
	y:9.81
}


class PlayerDot
	constructor: (@color="#F00", @width=10, @height=10) ->


class EnemyDot
	constructor: (@position={x:50, y:50},  @velocity={x:0, y:0}, @width=10, @height=10, @color="#000") ->
	update: (t) ->
		#javascript y u no operator overloading?

		if @velocity.x != 0
			@position.x += (@velocity.x * t) + 0.5 * (G.gravity.x * (t * t))
		if @velocity.y != 0
			@position.y += (@velocity.y * t) + 0.5 * (G.gravity.y * (t * t))
		
		@velocity.x = @velocity.x + (G.gravity.x * t)
		@velocity.y = @velocity.y + (G.gravity.y * t)

	draw: (cnv=G.mainCanvas) ->
		cnv.strokeStyle = @color
		cnv.beginPath()
		cnv.moveTo @position.x, @position.y
		cnv.lineTo @position.x+2, @position.y+2
		cnv.closePath()
		cnv.stroke()

$ ->
	$("#cnv").attr('width', window.innerWidth)
	$("#cnv").attr('height', window.innerHeight)
	G.mainCanvas = document.getElementById("cnv").getContext('2d')
	G.mainCanvas.strokeStyle = "#F00"

	dots = []
	times 20, ->
		dots.push(new EnemyDot(position={x:Math.random()*1000, y:Math.random()*1000}))

	iPhone = new Controller()
	###
	iPhone.on 'mousemove', (evt) ->
		drawDot(evt.x, evt.y)
	###
	iPhone.on 'mousedown', (evt) ->
		drawDot(evt.x, evt.y)
	###
	iPhone.on 'touchmove', (evt) ->
		drawDot(evt.x, evt.y)
	###


	gameloop = ->
		G.mainCanvas.clearRect(0,0,1000,1000)

		(dot.update(0.025) for dot in dots) #need to fix the time (0.025??)
		(dot.draw() for dot in dots)
		webkitRequestAnimationFrame(gameloop) #should use a shim for this

	gameloop()

G.rotateworld = (rads) ->
	G.gravity.x = Math.sin(rads) * 9.81
	G.gravity.y = Math.cos(rads) * 9.81