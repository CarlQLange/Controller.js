var Set, after, every, map, once, print, reduce, times,
  __slice = Array.prototype.slice;

print = function() {
  var msg;
  msg = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  return console.log(msg);
};

/*
print "I like cake", "so much"
*/

after = function(ms, fn) {
  return setTimeout(fn, ms);
};

/*
after 50, ->
	console.log "50 ms passed!"
*/

every = function(ms, fn) {
  return setInterval(fn, ms);
};

/*
every 300, ->
	console.log "another 300 seconds!"
*/

times = function(n, fn) {
  var _results;
  _results = [];
  while (n) {
    fn();
    _results.push(n--);
  }
  return _results;
};

/*
times 6, ->
	console.log "called six times!"
*/

once = function(exp, fn) {
  if (exp()) {
    return fn();
  } else {
    return after(1000, function() {
      return once(exp, fn);
    });
  }
};

/*
class V
  constructor: (@a, @b) ->
  setB: (b) -> @b = b
  go: () -> 
	  once (=> @a == @b), ( => console.log "equal!")

v = new V(1,4)
v.go()
after 1000, ->
	v.setB(1)
*/

/*
t = false
once (-> t == true), ->
	console.log "yay"
after 3000, ->
	t = true
*/

map = function(a, fn) {
  var el, _i, _len, _results;
  _results = [];
  for (_i = 0, _len = a.length; _i < _len; _i++) {
    el = a[_i];
    _results.push(fn(el));
  }
  return _results;
};

/*
map ["a", "b"], console.log
*/

reduce = function(a, init, fn) {
  var el, s, _i, _len;
  s = init;
  for (_i = 0, _len = a.length; _i < _len; _i++) {
    el = a[_i];
    s = fn(s, el);
  }
  return s;
};

/*
console.log( 
	reduce ["a", "b", "c"], "", (a,b)->a+b
)
*/

String.prototype.startsWith = function(s) {
  return this.slice(0, s.length) === s;
};

String.prototype.endsWith = function(s) {
  return this.slice(this.length - s.length) === s;
};

Set = (function() {

  function Set() {
    var elem, elems, _i, _len;
    elems = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    this.hash = {};
    for (_i = 0, _len = elems.length; _i < _len; _i++) {
      elem = elems[_i];
      this.hash[elem] = true;
    }
  }

  Set.prototype.add = function(elem) {
    return this.hash[elem] = true;
  };

  Set.prototype.remove = function(elem) {
    return delete this.hash[elem];
  };

  Set.prototype.has = function(elem) {
    return this.hash[elem] != null;
  };

  Set.prototype.union = function(set2) {
    var elem, set, _i, _len, _ref;
    set = new Set();
    for (elem in this.hash) {
      set.add(elem);
    }
    _ref = set2.to_array();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      elem = _ref[_i];
      set.add(elem);
    }
    return set;
  };

  Set.prototype.intersection = function(set2) {
    var elem, set;
    set = new Set();
    for (elem in this.hash) {
      if (set2.has(elem)) set.add(elem);
    }
    return set;
  };

  Set.prototype.minus = function(set2) {
    var elem, set;
    set = new Set();
    for (elem in this.hash) {
      if (!set2.has(elem)) set.add(elem);
    }
    return set;
  };

  Set.prototype.is_subset_of = function(set2) {
    var elem;
    for (elem in this.hash) {
      if (!set2.has(elem)) return false;
    }
    return true;
  };

  Set.prototype.equals = function(set2) {
    return this.is_subset_of(set2) && set2.is_subset_of(this);
  };

  Set.prototype.to_array = function() {
    var elem, _results;
    _results = [];
    for (elem in this.hash) {
      _results.push(elem);
    }
    return _results;
  };

  Set.prototype.each = function(f) {
    var elem, _results;
    _results = [];
    for (elem in this.hash) {
      _results.push(f(elem));
    }
    return _results;
  };

  Set.prototype.to_string = function() {
    return this.to_array();
  };

  return Set;

})();
