# EXTINCTION EVENT

G = window
rrr = Math.random #too many damn keystrokes
G.canvaswidth = 1280
G.canvasheight = 800

class V2
	constructor: (@x,@y) ->

	add: (v) ->
		tx = @x + v.x
		ty = @y + v.y
		new V2(tx, ty)
	sub: (v) ->
		tx = @x - v.x
		ty = @y - v.y
		new V2(tx, ty)
	mul: (i) ->
		tx = @x * i
		ty = @y * i
		new V2(tx, ty)
	rot: (i) ->
		tx = @len() * Math.sin(i)
		ty = @len() * Math.cos(i)
		new V2(tx, ty)
	nor: () ->
		new V2(@x / @len(), @y / @len())
	len: () ->
		Math.sqrt(@x*@x + @y*@y)


class Asteroid
	constructor: (@pos, @mass) ->
		@vel = new V2(1,0)
		@vel = @vel.rot((rrr()*Math.PI/1.5))
		@w = @mass*24
		@h = @mass*24
		@img = new Image()
		@img.src = "./monochromedino/asteroid.png"
	draw: () ->
		#our asteroids are cuuuuubes
		c = G.ctx

		c.drawImage(@img, @pos.x, @pos.y, @w, @h)

		#c.beginPath()
		#c.moveToV(@pos)
		#c.lineToV(@pos.add(new V2(0,@h)))
		#c.lineToV(@pos.add(new V2(@w,@h)))
		#c.lineToV(@pos.add(new V2(@w,0)))
		#c.closePath()
		#c.stroke()
		
		return @
	
	update: (dt) ->
		#y u no operator overloading
		if G.player.collides([@pos, new V2(@pos.x+@w, @pos.y+@h)])
			G.player.collisionResponse()

		if dt
			@pos = @pos.add(@vel.add(G.GRAV.mul(@mass).mul(dt)))

		#if @pos.sub(G.player.pos).length < 100
		

		return @

class God
	#because I didn't want to name a class AsteroidManager
	constructor: (@limit=8) ->
		@asteroids = []
		@stopped = false
		times @limit, =>
			@asteroids.push(new Asteroid(new V2(rrr()*G.canvaswidth,50), (rrr()*2) + 0.6))

	update: (dt) ->
		#remove or add as needed

		#add new 'roids
		if !@stopped
			times @limit - @asteroids.length, =>
				if rrr() > 0.2
					@asteroids.push(new Asteroid(new V2(rrr()*G.canvaswidth,-50), (rrr()*2) + 0.6))

		#remove 'roids
		for i, a of @asteroids
			if a.pos.y > G.canvasheight
				@asteroids.splice(i, 1)
			
		#now update all asteroids
		(a.update(dt) for a in @asteroids)

		return @

	draw: () ->
		(a.draw() for a in @asteroids)

		return @

	rotall: (n) ->
		(a.vel.rot(n) for a in @asteroids)

class Dinosaur
	constructor: (@pos) ->
		@mass = 1
		@vel = new V2(0,0)
		@acc = new V2(0,0)
		@w = 50
		@h = 50
		@idleimg = new Image()
		@idleimg.src = "./monochromedino/idle/monodinoidle.png"

		@frame = 0
		@animimgs = []
		times 13, =>
			@animimgs.push(new Image())

		for i of @animimgs
			a = +i+1
			@animimgs[i].src = "./monochromedino/walk/monodinowalk" + a + ".png"

	draw: () ->
		c = G.ctx
		
		#FUCCCK
		#no time to make him reverse

		#if (@vel.len() < 1)
		#	c.drawImage(@idleimg, @pos.x, @pos.y, @w, @h)
		#else
		#if (@vel.x < 0)
		@frame++
		if @frame >= 13
			@frame = 1
		img = @animimgs[@frame]
		c.drawImage(img, @pos.x, @pos.y, @w, @h)
		
		#	@frame++
		#	if @frame >= 13
		#		@frame = 1
		#	img = @animimgs[@frame]
		#	c.drawImage(img, @pos.x, @pos.y, -@w, -@h)


		return @

	update: (dt) ->
		@pos = @pos.add(@vel.add(@acc.mul(dt)))

		if @pos.x + @w > G.canvaswidth
			@pos.x -= G.canvaswidth
		if @pos.x < 0
			@pos.x += G.canvaswidth

		return @

	#where aabb is [V2, V2]
	collides: (aabb) ->
		#debugger
		otl = aabb[0]
		obr = aabb[1]

		tl = @pos
		br = new V2(@pos.x + @w, @pos.y + @h)

		if otl.x > tl.x-10 and otl.y > tl.y-10
			if obr.y < br.y+10 and obr.x < br.x+10
				return true
		return false

	collisionResponse: () ->
		@col = true
		#alert("Collide!")


class Background
	constructor: (@col="#444") ->
	draw: () ->
		c = G.ctx

		c.fillStyle = @col
		c.fillRect(0, 0, G.canvaswidth, G.canvasheight)

		c.beginPath()
		c.moveTo(0, G.canvasheight-100)
		c.lineTo(G.canvaswidth, G.canvasheight-100)
		c.closePath()
		c.strokeStyle = "#AAA"
		c.stroke()

		return @

controller = new Controller(server="http://127.0.0.1:1338")
controller.on 'deviceorientation', (evt) ->
	#G.GRAV = G.GRAV.rot(evt.beta*Math.PI/180)
	G.player.acc.x = evt.beta

###
$(document).on 'keydown', (evt) ->
	evt = evt.originalEvent
	if evt.keyIdentifier is "Left"
		G.player.acc.x--
	if evt.keyIdentifier is "Right"
		G.player.acc.x++
###

##################################################
##################################################
$ ->
	G.GRAV = new V2(0, 9.81)

	G.cnv = $('#gamecanvas')[0]
	G.ctx = G.cnv.getContext '2d'
	G.ctx.strokeStyle = '#FFF'
	G.ctx.fillStyle = '#FFF'

	#for ease of use w/ V2
	G.ctx.moveToV = (v) ->
		@.moveTo(v.x, v.y)
	G.ctx.lineToV = (v) ->
		@.lineTo(v.x, v.y)

	bg = new Background()

	god = new God()

	G.player = new Dinosaur(new V2(300,G.canvasheight-150))

	gameloop = ->
		bg.draw()

		god.update(0.25).draw()
		G.player.update(0.25).draw()

		if G.player.col then gameOver()

		if !G.player.col then webkitRequestAnimationFrame(gameloop) #should use a shim for this

	gameloop()

	every 6000, ->
	if (G.GRAV.y < 20)
		G.GRAV.y += G.GRAV.y/20

	every 14000, ->
		if (G.GRAV.y < 20)
			G.GRAV.y += G.GRAV.y/10

	gameOver = () ->
		god.stopped = true

		bg.col = "#EEE"
		bg.draw()

		after 400, ->
	
			bg.col = "#444"
			bg.draw()
			G.ctx.font = "60px Gill Sans"
			G.ctx.fillStyle = "#9A9A9A"
			G.ctx.fillText("DEEEEEEEEEEAAAAAAAAAAD", 260, G.canvasheight-100)
			every 400, ->
				bg.draw()
				G.ctx.font = "60px Gill Sans"
				G.ctx.fillStyle = "#AAA"

				G.ctx.fillText("DEEEEEEEEEEAAAAAAAAAAD", 260, G.canvasheight-100)
				#god.update(0).draw()