
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
    return G.socket.on('regevt', function(evtname) {
      return $("#cnv").on(evtname, function(evt) {
        return G.socket.emit('evt', stripevent(evt));
      });
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
