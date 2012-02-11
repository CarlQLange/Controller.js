(function() {
  var EnemyDot, G, PlayerDot;

  G = window;

  /*
  drawDot = (x, y, cnv=G.mainCanvas) ->
  	cnv.beginPath()
  	cnv.moveTo x, y
  	cnv.lineTo x+2, y+2
  	cnv.closePath()
  	cnv.stroke()
  */

  G.gravity = {
    x: 0,
    y: 9.81
  };

  PlayerDot = (function() {

    function PlayerDot(color, width, height) {
      this.color = color != null ? color : "#F00";
      this.width = width != null ? width : 10;
      this.height = height != null ? height : 10;
    }

    return PlayerDot;

  })();

  EnemyDot = (function() {

    function EnemyDot(position, velocity, width, height, color) {
      this.position = position != null ? position : {
        x: 50,
        y: 50
      };
      this.velocity = velocity != null ? velocity : {
        x: 0,
        y: 0
      };
      this.width = width != null ? width : 10;
      this.height = height != null ? height : 10;
      this.color = color != null ? color : "#000";
    }

    EnemyDot.prototype.update = function(t) {
      if (this.velocity.x !== 0) {
        this.position.x += (this.velocity.x * t) + 0.5 * (G.gravity.x * (t * t));
      }
      if (this.velocity.y !== 0) {
        this.position.y += (this.velocity.y * t) + 0.5 * (G.gravity.y * (t * t));
      }
      this.velocity.x = this.velocity.x + (G.gravity.x * t);
      return this.velocity.y = this.velocity.y + (G.gravity.y * t);
    };

    EnemyDot.prototype.draw = function(cnv) {
      if (cnv == null) cnv = G.mainCanvas;
      cnv.strokeStyle = this.color;
      cnv.beginPath();
      cnv.moveTo(this.position.x, this.position.y);
      cnv.lineTo(this.position.x + 2, this.position.y + 2);
      cnv.closePath();
      return cnv.stroke();
    };

    return EnemyDot;

  })();

  $(function() {
    var dots, gameloop, iPhone;
    $("#cnv").attr('width', window.innerWidth);
    $("#cnv").attr('height', window.innerHeight);
    G.mainCanvas = document.getElementById("cnv").getContext('2d');
    G.mainCanvas.strokeStyle = "#F00";
    dots = [];
    times(20, function() {
      var position;
      return dots.push(new EnemyDot(position = {
        x: Math.random() * 1000,
        y: Math.random() * 1000
      }));
    });
    iPhone = new Controller();
    /*
    	iPhone.on 'mousemove', (evt) ->
    		drawDot(evt.x, evt.y)
    */
    iPhone.on('mousedown', function(evt) {
      return drawDot(evt.x, evt.y);
    });
    /*
    	iPhone.on 'touchmove', (evt) ->
    		drawDot(evt.x, evt.y)
    */
    gameloop = function() {
      var dot, _i, _j, _len, _len2;
      G.mainCanvas.clearRect(0, 0, 1000, 1000);
      for (_i = 0, _len = dots.length; _i < _len; _i++) {
        dot = dots[_i];
        dot.update(0.025);
      }
      for (_j = 0, _len2 = dots.length; _j < _len2; _j++) {
        dot = dots[_j];
        dot.draw();
      }
      return webkitRequestAnimationFrame(gameloop);
    };
    return gameloop();
  });

  G.rotateworld = function(rads) {
    G.gravity.x = Math.sin(rads) * 9.81;
    return G.gravity.y = Math.cos(rads) * 9.81;
  };

}).call(this);
