const test = require('tape')

const {
  EventEmitter
} = require('events')

const clean = require('../../lib/reporters/clean')

class FakeRunner extends EventEmitter {
  constructor() {
    super()

    this.output = []
  }

  log(_log) {
    this.output.push(_log)
  }
}

test('@reporters/clean', t => {
  t.test('should be able to output simple benchmark report', t => {
    t.plan(1);

    const runner = new FakeRunner()

    clean(runner)

    runner.emit('start')
    runner.emit('suite start', {
      title: 'foo'
    })
    runner.emit('bench start', {
      title: 'foo-child'
    })
    runner.emit('bench end', {
      title: 'foo',
      ops: 12702222
    })
    runner.emit('suite end')
    runner.emit('end', {
      suites: 1,
      benches: 1,
      elapsed: 1816.519502
    })

    t.deepEqual(runner.output, ['',
      '                      foo',
      '\x1b[36m      12,702,222 op/s\x1b[39m\x1b[90m » foo\x1b[39m',
      '',
      '\x1b[90m  Suites:  \x1b[39m1',
      '\x1b[90m  Benches: \x1b[39m1',
      '\x1b[90m  Elapsed: \x1b[39m1,816.52 ms',
      ''
    ])
  })
})
