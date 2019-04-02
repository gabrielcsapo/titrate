const test = require('tape')

const { humanize } = require('../lib/utils')

test('@utils', t => {
  t.test('@humanize', t => {
    t.test('should be able to resolve milliseconds to a human readable number', t => {
      t.plan(1)

      const humanized = humanize(12614806)

      t.equal(humanized, '12,614,806')
    })
  })
})
