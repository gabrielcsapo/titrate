var i = 0

suite('single', function () {
  set('iterations', 1)
  set('type', 'static')

  bench('i', function () {
    i++
  })
})

process.on('exit', function () {
  if (i !== 1) throw new Error('single ran for ' + i + ' iterations')
})
