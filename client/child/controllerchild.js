
/* controllerchild.coffee
*/

(function() {
  var G;

  G = window;

  $(function() {
    var parentid;
    $("#cnv").attr('width', window.innerWidth);
    $("#cnv").attr('height', window.innerHeight);
    parentid = document.URL.split("?id=")[1].split("/")[0];
    G.socket = io.connect('http://127.0.0.1:1338');
    G.socket.emit('child', parentid);
    $("#cnv").on('mousedown', function(evt) {
      var evtsend;
      evtsend = {
        x: evt.offsetX,
        y: evt.offsetY,
        type: 'mousedown'
      };
      return G.socket.emit('evt', evtsend);
    });
    $("#cnv").on('mousemove', function(evt) {
      var evtsend;
      evtsend = {
        x: evt.offsetX,
        y: evt.offsetY,
        type: 'mousemove'
      };
      return G.socket.emit('evt', evtsend);
    });
    return $("#cnv").on('touchmove', function(evt) {
      var evtsend, touch;
      event.preventDefault();
      if (evt.originalEvent.touches.length === 1) {
        touch = evt.originalEvent.touches[0];
        evtsend = {
          x: touch.pageX,
          y: touch.pageY,
          type: 'touchmove'
        };
      }
      return G.socket.emit('evt', evtsend);
    });
  });

}).call(this);
