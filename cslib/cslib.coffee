print = (msg...) -> 
	console.log(msg)

###
print "I like cake", "so much"
###

after = (ms, fn) ->
	setTimeout(fn, ms)

###
after 50, ->
	console.log "50 ms passed!"
###

every = (ms, fn) ->
	setInterval(fn, ms)

###
every 300, ->
	console.log "another 300 seconds!"
###

times = (n, fn) ->
	while n
		fn()
		n--

###
times 6, ->
	console.log "called six times!"
###

once = (exp, fn) ->
	if exp()
		fn()
	else
		after 1000, -> once(exp, fn)

###
class V
  constructor: (@a, @b) ->
  setB: (b) -> @b = b
  go: () -> 
	  once (=> @a == @b), ( => console.log "equal!")

v = new V(1,4)
v.go()
after 1000, ->
	v.setB(1)
###
###
t = false
once (-> t == true), ->
	console.log "yay"
after 3000, ->
	t = true
###

map = (a, fn) ->
	(fn(el) for el in a)

###
map ["a", "b"], console.log
###

reduce = (a, init, fn) ->
	s = init
	for el in a
		s = fn(s, el)
	return s

###
console.log( 
	reduce ["a", "b", "c"], "", (a,b)->a+b
)
###

String::startsWith = (s) ->
	this[...s.length] == s

String::endsWith = (s) -> 
	this[this.length-s.length...] == s


###############

class Set    
	constructor: (elems...) ->
		@hash = {}
		for elem in elems
			@hash[elem] = true
 
	add: (elem) ->
		@hash[elem] = true
 
	remove: (elem) ->
		delete @hash[elem]
 
	has: (elem) ->
		@hash[elem]?
 
	union: (set2) ->
		set = new Set()
		for elem of @hash
			set.add elem
		for elem in set2.to_array()
			set.add elem
		set
 
	intersection: (set2) ->
		set = new Set()
		for elem of @hash
			set.add elem if set2.has elem
		set
 
	minus: (set2) ->
		set = new Set()
		for elem of @hash
			set.add elem if !set2.has elem
		set
 
	is_subset_of: (set2) ->
		for elem of @hash
			return false if !set2.has elem
		true
 
	equals: (set2) ->
		this.is_subset_of(set2) and set2.is_subset_of(this)
 
	to_array: ->
		(elem for elem of @hash)
 
	each: (f) ->
		for elem of @hash
			f(elem)
 
	to_string: ->
		@to_array()