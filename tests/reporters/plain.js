const test = require('tape')

const {
  EventEmitter
} = require('events')

const plain = require('../../lib/reporters/plain')

class FakeRunner extends EventEmitter {
  constructor () {
    super()

    this.output = []
  }

  log (_log) {
    this.output.push(_log)
  }
}

test('@reporters/plain', t => {
  t.test('should be able to output simple benchmark report', t => {
    t.plan(1);

    const runner = new FakeRunner()

    plain(runner)

    runner.emit('start')
    runner.emit('suite start', {
      title: 'foo'
    })
    runner.emit('bench start', {
      title: 'foo-child'
    })
    runner.emit('bench end', {
      ops: 12702222
    })
    runner.emit('suite end')
    runner.emit('end', {
      suites: 1,
      benches: 1,
      elapsed: 1816.519502
    })

    t.deepEqual(runner.output, ['',
      'foo',
      '12,702,222 op/s',
      '',
      'Suites:  1',
      'Benches: 1',
      'Elapsed: 1,816.52 ms'
    ])
  })
})
