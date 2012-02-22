
/* controllerchild.coffee
*/

(function() {
  var G, run, stripevent;

  G = window;

  window.onload = function() {
    var enterbutton, textfield;
    G.socket = io.connect('http://127.0.0.1:1338');
    enterbutton = document.querySelector('#enterid');
    textfield = document.querySelector('#idinput');
    return enterbutton.addEventListener('click', function(evt) {
      if (textfield.value) {
        enterbutton.style.display = 'none';
        textfield.style.display = 'none';
        return run(textfield.value);
      }
    });
  };

  run = function(parentid) {
    console.log(parentid);
    G.socket.emit('child', parentid);
    return G.socket.on('regevt', function(evtname) {
      return document.addEventListener(evtname, function(evt) {
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
