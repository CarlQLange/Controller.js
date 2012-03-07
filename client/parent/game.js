(function() {
  var Asteroid, Background, Dinosaur, G, God, V2, controller, rrr, server;

  G = window;

  rrr = Math.random;

  G.canvaswidth = 1280;

  G.canvasheight = 800;

  V2 = (function() {

    function V2(x, y) {
      this.x = x;
      this.y = y;
    }

    V2.prototype.add = function(v) {
      var tx, ty;
      tx = this.x + v.x;
      ty = this.y + v.y;
      return new V2(tx, ty);
    };

    V2.prototype.sub = function(v) {
      var tx, ty;
      tx = this.x - v.x;
      ty = this.y - v.y;
      return new V2(tx, ty);
    };

    V2.prototype.mul = function(i) {
      var tx, ty;
      tx = this.x * i;
      ty = this.y * i;
      return new V2(tx, ty);
    };

    V2.prototype.rot = function(i) {
      var tx, ty;
      tx = this.len() * Math.sin(i);
      ty = this.len() * Math.cos(i);
      return new V2(tx, ty);
    };

    V2.prototype.nor = function() {
      return new V2(this.x / this.len(), this.y / this.len());
    };

    V2.prototype.len = function() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    };

    return V2;

  })();

  Asteroid = (function() {

    function Asteroid(pos, mass) {
      this.pos = pos;
      this.mass = mass;
      this.vel = new V2(1, 0);
      this.vel = this.vel.rot(rrr() * Math.PI / 1.5);
      this.w = this.mass * 24;
      this.h = this.mass * 24;
      this.img = new Image();
      this.img.src = "./monochromedino/asteroid.png";
    }

    Asteroid.prototype.draw = function() {
      var c;
      c = G.ctx;
      c.drawImage(this.img, this.pos.x, this.pos.y, this.w, this.h);
      return this;
    };

    Asteroid.prototype.update = function(dt) {
      if (G.player.collides([this.pos, new V2(this.pos.x + this.w, this.pos.y + this.h)])) {
        G.player.collisionResponse();
      }
      if (dt) this.pos = this.pos.add(this.vel.add(G.GRAV.mul(this.mass).mul(dt)));
      return this;
    };

    return Asteroid;

  })();

  God = (function() {

    function God(limit) {
      var _this = this;
      this.limit = limit != null ? limit : 8;
      this.asteroids = [];
      this.stopped = false;
      times(this.limit, function() {
        return _this.asteroids.push(new Asteroid(new V2(rrr() * G.canvaswidth, 50), (rrr() * 2) + 0.6));
      });
    }

    God.prototype.update = function(dt) {
      var a, i, _i, _len, _ref, _ref2,
        _this = this;
      if (!this.stopped) {
        times(this.limit - this.asteroids.length, function() {
          if (rrr() > 0.2) {
            return _this.asteroids.push(new Asteroid(new V2(rrr() * G.canvaswidth, -50), (rrr() * 2) + 0.6));
          }
        });
      }
      _ref = this.asteroids;
      for (i in _ref) {
        a = _ref[i];
        if (a.pos.y > G.canvasheight) this.asteroids.splice(i, 1);
      }
      _ref2 = this.asteroids;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        a = _ref2[_i];
        a.update(dt);
      }
      return this;
    };

    God.prototype.draw = function() {
      var a, _i, _len, _ref;
      _ref = this.asteroids;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        a = _ref[_i];
        a.draw();
      }
      return this;
    };

    God.prototype.rotall = function(n) {
      var a, _i, _len, _ref, _results;
      _ref = this.asteroids;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        a = _ref[_i];
        _results.push(a.vel.rot(n));
      }
      return _results;
    };

    return God;

  })();

  Dinosaur = (function() {

    function Dinosaur(pos) {
      var a, i,
        _this = this;
      this.pos = pos;
      this.mass = 1;
      this.vel = new V2(0, 0);
      this.acc = new V2(0, 0);
      this.w = 50;
      this.h = 50;
      this.idleimg = new Image();
      this.idleimg.src = "./monochromedino/idle/monodinoidle.png";
      this.frame = 0;
      this.animimgs = [];
      times(13, function() {
        return _this.animimgs.push(new Image());
      });
      for (i in this.animimgs) {
        a = +i + 1;
        this.animimgs[i].src = "./monochromedino/walk/monodinowalk" + a + ".png";
      }
    }

    Dinosaur.prototype.draw = function() {
      var c, img;
      c = G.ctx;
      this.frame++;
      if (this.frame >= 13) this.frame = 1;
      img = this.animimgs[this.frame];
      c.drawImage(img, this.pos.x, this.pos.y, this.w, this.h);
      return this;
    };

    Dinosaur.prototype.update = function(dt) {
      this.pos = this.pos.add(this.vel.add(this.acc.mul(dt)));
      if (this.pos.x + this.w > G.canvaswidth) this.pos.x -= G.canvaswidth;
      if (this.pos.x < 0) this.pos.x += G.canvaswidth;
      return this;
    };

    Dinosaur.prototype.collides = function(aabb) {
      var br, obr, otl, tl;
      otl = aabb[0];
      obr = aabb[1];
      tl = this.pos;
      br = new V2(this.pos.x + this.w, this.pos.y + this.h);
      if (otl.x > tl.x - 10 && otl.y > tl.y - 10) {
        if (obr.y < br.y + 10 && obr.x < br.x + 10) return true;
      }
      return false;
    };

    Dinosaur.prototype.collisionResponse = function() {
      return this.col = true;
    };

    return Dinosaur;

  })();

  Background = (function() {

    function Background(col) {
      this.col = col != null ? col : "#444";
    }

    Background.prototype.draw = function() {
      var c;
      c = G.ctx;
      c.fillStyle = this.col;
      c.fillRect(0, 0, G.canvaswidth, G.canvasheight);
      c.beginPath();
      c.moveTo(0, G.canvasheight - 100);
      c.lineTo(G.canvaswidth, G.canvasheight - 100);
      c.closePath();
      c.strokeStyle = "#AAA";
      c.stroke();
      return this;
    };

    return Background;

  })();

  controller = new Controller(server = "http://127.0.0.1:1338");

  controller.on('deviceorientation', function(evt) {
    return G.player.acc.x = evt.beta;
  });

  /*
  $(document).on 'keydown', (evt) ->
  	evt = evt.originalEvent
  	if evt.keyIdentifier is "Left"
  		G.player.acc.x--
  	if evt.keyIdentifier is "Right"
  		G.player.acc.x++
  */

  $(function() {
    var bg, gameOver, gameloop, god;
    G.GRAV = new V2(0, 9.81);
    G.cnv = $('#gamecanvas')[0];
    G.ctx = G.cnv.getContext('2d');
    G.ctx.strokeStyle = '#FFF';
    G.ctx.fillStyle = '#FFF';
    G.ctx.moveToV = function(v) {
      return this.moveTo(v.x, v.y);
    };
    G.ctx.lineToV = function(v) {
      return this.lineTo(v.x, v.y);
    };
    bg = new Background();
    god = new God();
    G.player = new Dinosaur(new V2(300, G.canvasheight - 150));
    gameloop = function() {
      bg.draw();
      god.update(0.25).draw();
      G.player.update(0.25).draw();
      if (G.player.col) gameOver();
      if (!G.player.col) return webkitRequestAnimationFrame(gameloop);
    };
    gameloop();
    every(6000, function() {});
    if (G.GRAV.y < 20) G.GRAV.y += G.GRAV.y / 20;
    every(14000, function() {
      if (G.GRAV.y < 20) return G.GRAV.y += G.GRAV.y / 10;
    });
    return gameOver = function() {
      god.stopped = true;
      bg.col = "#EEE";
      bg.draw();
      return after(400, function() {
        bg.col = "#444";
        bg.draw();
        G.ctx.font = "60px Gill Sans";
        G.ctx.fillStyle = "#9A9A9A";
        G.ctx.fillText("DEEEEEEEEEEAAAAAAAAAAD", 260, G.canvasheight - 100);
        return every(400, function() {
          bg.draw();
          G.ctx.font = "60px Gill Sans";
          G.ctx.fillStyle = "#AAA";
          return G.ctx.fillText("DEEEEEEEEEEAAAAAAAAAAD", 260, G.canvasheight - 100);
        });
      });
    };
  });

}).call(this);
