const test = require('tape')

const {
  EventEmitter
} = require('events')

const json = require('../../lib/reporters/json')

class FakeRunner extends EventEmitter {
  constructor() {
    super()

    this.output = []
  }

  log(_log) {
    this.output.push(_log)
  }
}

test('@reporters/json', t => {
  t.test('should be able to output simple benchmark report', t => {
    t.plan(1);

    const runner = new FakeRunner()

    json(runner)

    runner.emit('start')
    runner.emit('suite start', {
      title: 'foo'
    })
    runner.emit('bench start', {
      title: 'foo-child'
    })
    runner.emit('bench end', {
      iterations: 8453882,
      elapsed: 678.7734989999999,
      title: 'Array.prototype.slice',
      ops: 12454644
    })
    runner.emit('suite end')
    runner.emit('end', {
      suites: 1,
      benches: 1,
      elapsed: 1816.519502
    })

    t.deepEqual(runner.output, ['{"runs":[{"suite":"foo","bench":"foo-child","results":{"iterations":8453882,"elapsed":678.7734989999999,"title":"Array.prototype.slice","ops":12454644}}],\n"stats":{"suites":1,"benches":1,"elapsed":1816.519502}}'])
  })
})
