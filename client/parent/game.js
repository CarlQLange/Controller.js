(function() {
  var G, Snowflake;

  G = window;

  G.gravity = {
    x: 0,
    y: 9.81
  };

  Snowflake = (function() {

    function Snowflake(position, velocity, size, color, maxvel) {
      this.position = position != null ? position : {
        x: 50,
        y: 50
      };
      this.velocity = velocity != null ? velocity : {
        x: 0,
        y: 0
      };
      this.size = size != null ? size : {
        w: 3,
        h: 3
      };
      this.color = color != null ? color : "#DDD";
      this.maxvel = maxvel != null ? maxvel : {
        x: 100,
        y: 100
      };
    }

    Snowflake.prototype.update = function(t) {
      if (Math.abs(this.velocity.x) > this.maxvel.x) {
        if (this.velocity.x < 0) {
          this.velocity.x = -this.maxvel.x;
        } else {
          this.velocity.x = this.maxvel.x;
        }
      }
      if (Math.abs(this.velocity.y) > this.maxvel.y) {
        if (this.velocity.y < 0) {
          this.velocity.y = -this.maxvel.y;
        } else {
          this.velocity.y = this.maxvel.y;
        }
      }
      if (this.velocity.x !== 0) {
        this.position.x += (this.velocity.x * t) + 0.5 * (G.gravity.x * (t * t));
      }
      if (this.velocity.y !== 0) {
        this.position.y += (this.velocity.y * t) + 0.5 * (G.gravity.y * (t * t));
      }
      this.velocity.x = this.velocity.x + (G.gravity.x * t);
      this.velocity.y = this.velocity.y + (G.gravity.y * t);
      if (this.position.x > G.mainCanvas.canvas.clientWidth) this.position.x = 0;
      if (this.position.y > G.mainCanvas.canvas.clientHeight) this.position.y = 0;
      if (this.position.x < 0) this.position.x = G.mainCanvas.canvas.clientWidth;
      if (this.position.y < 0) this.position.y = G.mainCanvas.canvas.clientHeight;
      return this;
    };

    Snowflake.prototype.draw = function(cnv) {
      if (cnv == null) cnv = G.mainCanvas;
      cnv.strokeStyle = this.color;
      cnv.beginPath();
      cnv.moveTo(this.position.x, this.position.y);
      cnv.lineTo(this.position.x, this.position.y + this.size.h);
      cnv.lineTo(this.position.x + this.size.w, this.position.y + this.size.h);
      cnv.lineTo(this.position.x + this.size.w, this.position.y);
      cnv.closePath();
      cnv.stroke();
      return this;
    };

    return Snowflake;

  })();

  window.onload = function() {
    var controller, flakes, gameloop;
    document.querySelector("#cnv").width = window.innerWidth;
    document.querySelector("#cnv").height = window.innerHeight;
    G.mainCanvas = document.getElementById("cnv").getContext('2d');
    G.mainCanvas.strokeStyle = "#F00";
    flakes = [];
    times(20, function() {
      var position;
      return flakes.push(new Snowflake(position = {
        x: Math.random() * 1000,
        y: Math.random() * 1000
      }));
    });
    /*here be magic
    */
    controller = new Controller();
    controller.on('mousedown', function(evt) {
      var position;
      return flakes.push(new Snowflake(position = {
        x: evt.x,
        y: evt.y
      }));
    });
    /*do you see how cool that is
    */
    controller.on('keydown', function(evt) {
      var flake, _i, _j, _len, _len2, _results;
      if (evt.keyIdentifier === "Left") {
        for (_i = 0, _len = flakes.length; _i < _len; _i++) {
          flake = flakes[_i];
          flake.position.x -= 8;
        }
      }
      if (evt.keyIdentifier === "Right") {
        _results = [];
        for (_j = 0, _len2 = flakes.length; _j < _len2; _j++) {
          flake = flakes[_j];
          _results.push(flake.position.x += 8);
        }
        return _results;
      }
    });
    controller.on('ondeviceorientation', function(evt) {
      var b, flake, _i, _j, _len, _len2, _results;
      if (evt.rotation !== null) {
        b = Math.round(rotation.beta);
        if (b < -20) {
          for (_i = 0, _len = flakes.length; _i < _len; _i++) {
            flake = flakes[_i];
            flake.position.x -= 8;
          }
        }
        if (b > 20) {
          _results = [];
          for (_j = 0, _len2 = flakes.length; _j < _len2; _j++) {
            flake = flakes[_j];
            _results.push(flake.position.x += 8);
          }
          return _results;
        }
      }
    });
    gameloop = function() {
      var flake, _i, _len;
      G.mainCanvas.fillStyle = "#4040C3";
      G.mainCanvas.fillRect(0, 0, G.mainCanvas.canvas.clientWidth, G.mainCanvas.canvas.clientHeight);
      for (_i = 0, _len = flakes.length; _i < _len; _i++) {
        flake = flakes[_i];
        flake.update(0.025).draw();
      }
      return webkitRequestAnimationFrame(gameloop);
    };
    return gameloop();
  };

  G.rotateworld = function(rads) {
    G.gravity.x = Math.sin(rads) * 9.81;
    return G.gravity.y = Math.cos(rads) * 9.81;
  };

}).call(this);
