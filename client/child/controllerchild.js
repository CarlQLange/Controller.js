
/* controllerchild.coffee
*/

(function() {
  var G, run, stripevent;

  G = window;

  $(function() {
    G.socket = io.connect('http://169.254.138.118:1338');
    return $('#enterid').click(function(evt) {
      $('#enterid').fadeOut();
      $('#idinput').fadeOut();
      return run($('#idinput').val());
    });
  });

  run = function(parentid) {
    console.log(parentid);
    G.socket.emit('child', parentid);
    return G.socket.on('regevt', function(evtname) {
      console.log($(window));
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
