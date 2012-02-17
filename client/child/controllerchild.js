
/* controllerchild.coffee
*/

(function() {
  var G, run, stripevent;

  G = window;

  $(function() {
    return $('#enterid').click(function(evt) {
      $('#enterid').fadeOut();
      $('#idinput').fadeOut();
      /*
      		$(document.body).append("""<canvas id='#cnv' style="
      			opacity: 0.0;
      			-moz-opacity: 0.0;
      			filter:alpha(opacity=0);
      			top: 0px;
      			left: 0px;
      			position: absolute;
      			width: 100%;
      			height: 100%;
      			"></canvas>""")
      */
      return run($('#idinput').val());
    });
  });

  run = function(parentid) {
    console.log(parentid);
    $("#cnv").attr('width', window.innerWidth).attr('height', window.innerHeight);
    G.socket = io.connect('http://127.0.0.1:1338');
    G.socket.emit('child', parentid);
    return G.socket.on('regevt', function(evtname) {
      return $(window).on(evtname, function(evt) {
        console.log(evt);
        return G.socket.emit('evt', stripevent(evt));
      });
    });
  };

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
