
suite('array type', function () {
  set('iterations', 2000000)

  var arr = []

  bench('Array.isArray', function () {
    var isArray = Array.isArray(arr)
  })

  bench('Object.prototype.toString.call', function () {
    var isArray = (Object.prototype.toString.call(arr) === '[object Array]')
  })
})
