
/* controllerchild.coffee
*/

(function() {
  var G, stripevent;

  G = window;

  $(function() {
    var parentid;
    $("#cnv").attr('width', window.innerWidth);
    $("#cnv").attr('height', window.innerHeight);
    parentid = document.URL.split("?id=")[1].split("/")[0];
    G.socket = io.connect('http://127.0.0.1:1338');
    G.socket.emit('child', parentid);
    $("#cnv").on('mousedown', function(evt) {
      return G.socket.emit('evt', stripevent(evt));
    });
    $("#cnv").on('mousemove', function(evt) {
      return G.socket.emit('evt', stripevent(evt));
    });
    $("#cnv").on('touchmove', function(evt) {
      /*
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
      */
    });
    return $("#cnv").on('ondevicemotion', function(evt) {
      var evtsend;
      evtsend = {
        accelerationIncludingGravity: {
          x: evt.accelerationIncludingGravity.x,
          y: evt.accelerationIncludingGravity.y,
          z: evt.accelerationIncludingGravity.z
        },
        rotation: evt.rotationRate
      };
      return G.socket.emit('evt', evtsend);
    });
  });

  stripevent = function(evt) {
    var key, ret, value, _ref;
    ret = {};
    _ref = evt.originalEvent;
    for (key in _ref) {
      value = _ref[key];
      if (typeof value !== 'function' && !key.endsWith('Element') && !key.endsWith('arget') && key !== 'view') {
        ret[key] = value;
      }
    }
    return JSON.stringify(ret);
  };

}).call(this);
