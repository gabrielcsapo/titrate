const { EventEmitter } = require('events')

const Timer = require('./timer')
const { series } = require('./utils')

/*!
 * proxy (from, to, event)
 *
 * Proxy an event from one object to another.
 *
 * @param {EventEmitter} from
 * @param {EventEmitter} to
 * @param {String} event
 * @api private
 */
function proxy (from, to, ev) {
  from.on(ev, function () {
    var args = Array.prototype.slice.call(arguments)

    var event = [ ev ].concat(args)
    to.emit.apply(to, event)
  })
};

/*!
 * runHooks (hooks, callback)
 *
 * Private function to handle the actual serial
 * running of hooks for before and after this
 * suite.
 *
 * @param {Array} hook functions
 * @param {Functon} callback
 * @api private
 */

function runHooks (hooks, done) {
  series(hooks, function (fn, next) {
    if (fn.length === 0) {
      try {
        fn()
      } catch (err) {
        return next(err)
      }
      next()
    } else {
      fn(next)
    }
  }, done)
}

class Runner extends EventEmitter {
  constructor (suite) {
    super()

    this.suite = suite
  }

  /**
   * Start the entire run sequence for a given
   * suite. The callback will be called upon
   * completion. Will call in the following order:
   *
   * - before hooks
   * - benches
   * - suites
   * - after hooks
   *
   * @method run
   * @param  {Function} done
   */
  run (done) {
    var self = this
    var stats = this.stats = { suites: 0, benches: 0 }

    function iterator (fn, next) {
      fn(next)
    }

    this.on('bench start', function () {
      stats.benches++
    })

    function next (err) {
      if (err) throw err
      stats.elapsed = self.timer.stop().elapsed
      self.emit('end', stats)
      done()
    }

    this.timer = new Timer().start()
    this.emit('start')

    series([
      this.runBefore.bind(this),
      this.runBenches.bind(this),
      this.runSuites.bind(this),
      this.runAfter.bind(this)
    ], iterator, next)
  }

  /**
   * Will invoke the `.run` method of each
   * bench in this suite serially, taking into
   * account the delay option of the suite.
   * @method runBenches
   * @param  {Function} done
   */
  runBenches (done) {
    var stats = []
    var suite = this.suite
    var delay = suite.options.delay

    series(suite.benches, delay, (bench, next) => {
      this.emit('bench start', bench)
      bench.run((res) => {
        stats.push(res)
        this.emit('bench end', res)
        next()
      })
    }, () => {
      this.emit('suite results', stats)
      done()
    })
  }

  /**
   * Will invoke the `.run` method of each
   * nested suite serially, taking into account
   * this suites delay between each suite.
   * @method runSuites
   * @param  {Function} done
   */
  runSuites (done) {
    var self = this
    var suite = this.suite
    var delay = suite.options.delay

    series(suite.suites, delay, function (suite, next) {
      var runner = new Runner(suite)
      proxy(runner, self, 'suite start')
      proxy(runner, self, 'suite end')
      proxy(runner, self, 'suite results')
      proxy(runner, self, 'bench start')
      proxy(runner, self, 'bench end')
      self.emit('suite start', suite)
      runner.run(function () {
        self.stats.suites++
        self.emit('suite end', suite)
        next()
      })
    }, done)
  }

  /**
   * Will invoke each before hook of the current
   * suite serially. Will take into account async
   * and sync functions.
   * @method runBefore
   * @param  {Function} done
   */
  runBefore (done) {
    runHooks.call(this, this.suite.before, done)
  }

  /**
   * Will invoke each after hook of the current
   * suite serially. Will take into account async
   * and sync functions.
   * @method runAfter
   * @param  {Function} done
   */
  runAfter (done) {
    runHooks.call(this, this.suite.after, done)
  }

  /**
   * outputs to data to the console
   * @method log
   */
  log (data) {
    console.log(data)
  }
}

module.exports = Runner
