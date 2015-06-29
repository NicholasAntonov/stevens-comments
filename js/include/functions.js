// Partially apply arguments to a function. Useful for binding
// specific data to an event handler.
// Example:
//
//   var add = function (x,y) { return x + y }
//   var add5 = add.papp(5)
//   add5(7) //=> 11
//
Function.prototype.papp = function () {
  var slice = Array.prototype.slice
  var fn = this
  var args = slice.call(arguments)
  return function () {
    return fn.apply(this, args.concat(slice.call(arguments)))
  }
}

// Prevents the default action. Useful for preventing
// anchor click page jumps and form submits.
// Example:
//
//   var x = 0
//   var increment = function () { x += 1 }
//   myAnchorEl.addEventListener('click', increment.chill())
//
Function.prototype.chill = function() {
  var fn = this
  return function(e) {
    e.preventDefault()
    return fn()
  }
}

// Both prevent default and partially apply in one go.
// Example:
//
//   var x = 0
//   var increment = function (amount) { x += amount }
//   myAnchorEl.addEventListener('click', increment.coldPapp(17))
//
Function.prototype.coldPapp = function() {
  var slice = Array.prototype.slice
  var fn = this
  var args = slice.call(arguments)
  return function(e) {
    e.preventDefault()
    return fn.apply(this, args.concat(slice.call(arguments, 1)))
  }
}


// Compose two functions together,
// piping the result of one to the other.
// Example:
//
//   var double = function (x) { return x * 2 }
//   var addOne = function (x) { return x + 1 }
//   var doublePlus = double.andThen(addOne)
//   doublePlus(3) //=> 7
//
Function.prototype.andThen = function(f) {
  var g = this
  return function() {
    var slice = Array.prototype.slice
    var args = slice.call(arguments)
    return f.call(this, g.apply(this, args))
  }
}
