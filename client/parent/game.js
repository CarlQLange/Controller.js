(function() {
  var G, after, drawDot;

  G = window;

  after = function(ms, func) {
    return setTimeout(func, ms);
  };

  drawDot = function(x, y, cnv) {
    if (cnv == null) cnv = G.mainCanvas;
    cnv.beginPath();
    cnv.moveTo(x, y);
    cnv.lineTo(x + 2, y + 2);
    cnv.closePath();
    return cnv.stroke();
  };

  $(function() {
    var iPhone;
    $("#cnv").attr('width', window.innerWidth);
    $("#cnv").attr('height', window.innerHeight);
    G.mainCanvas = document.getElementById("cnv").getContext('2d');
    G.mainCanvas.strokeStyle = "#F00";
    iPhone = new Controller();
    iPhone.on('mousemove', function(evt) {
      return drawDot(evt.x, evt.y);
    });
    iPhone.on('mousedown', function(evt) {
      return drawDot(evt.x, evt.y);
    });
    return iPhone.on('touchmove', function(evt) {
      return drawDot(evt.x, evt.y);
    });
  });

}).call(this);
