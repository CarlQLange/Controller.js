G = window

G.gravity = {
	x:0
	y:9.81
}

class Snowflake
	constructor: (@position={x:50,y:50},@velocity={x:0,y:0},@size={w:3,h:3},@color="#DDD",@maxvel={x:100,y:100}) ->
	update: (t) ->
		#javascript y u no operator overloading?
		#am I doing something wrong here? who cares?

		#stop the particles moving stupidly fast
		if Math.abs(@velocity.x) > @maxvel.x
			if @velocity.x < 0 then @velocity.x = -@maxvel.x
			else @velocity.x = @maxvel.x
		if Math.abs(@velocity.y) > @maxvel.y
			if @velocity.y < 0 then @velocity.y = -@maxvel.y
			else @velocity.y = @maxvel.y


		if @velocity.x != 0
			@position.x += (@velocity.x * t) + 0.5 * (G.gravity.x * (t * t))
		if @velocity.y != 0
			@position.y += (@velocity.y * t) + 0.5 * (G.gravity.y * (t * t))


		@velocity.x = @velocity.x + (G.gravity.x * t)
		@velocity.y = @velocity.y + (G.gravity.y * t)

		#wrap around
		if @position.x > G.mainCanvas.canvas.clientWidth then @position.x = 0
		if @position.y > G.mainCanvas.canvas.clientHeight then @position.y = 0
		if @position.x < 0 then @position.x = G.mainCanvas.canvas.clientWidth
		if @position.y < 0 then@position.y = G.mainCanvas.canvas.clientHeight

	draw: (cnv=G.mainCanvas) ->
		cnv.strokeStyle = @color
		cnv.beginPath()
		cnv.moveTo @position.x, @position.y
		cnv.lineTo @position.x, @position.y+@size.h
		cnv.lineTo @position.x+@size.w, @position.y+@size.h
		cnv.lineTo @position.x+@size.w, @position.y
		cnv.closePath()
		cnv.stroke()

$ ->
	$("#cnv").attr('width', window.innerWidth)
	$("#cnv").attr('height', window.innerHeight)
	G.mainCanvas = document.getElementById("cnv").getContext('2d')
	G.mainCanvas.strokeStyle = "#F00"

	flakes = []
	times 20, ->
		flakes.push(new Snowflake(position={
			x:Math.random()*1000,  #fix these
			y:Math.random()*1000
		}))

		###here be magic###
	iPhone = new Controller()
	iPhone.on 'mousedown', (evt) ->
		flakes.push(new Snowflake(position={x:evt.x, y:evt.y}))

	gameloop = ->
		G.mainCanvas.fillStyle = "#4040C3"
		G.mainCanvas.fillRect(
			0,0,G.mainCanvas.canvas.clientWidth,G.mainCanvas.canvas.clientHeight
		)

		(flake.update(0.025) for flake in flakes) #need to fix the time
		(flake.draw() for flake in flakes)
		webkitRequestAnimationFrame(gameloop) #should use a shim for this

	gameloop()

G.rotateworld = (rads) -> #global so I can access it from the webkit console
	G.gravity.x = Math.sin(rads) * 9.81
	G.gravity.y = Math.cos(rads) * 9.81