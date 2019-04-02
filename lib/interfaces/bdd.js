const Suite = require('../suite')
const Bench = require('../bench')

module.exports = function (_interface) {
  const suite = _interface.suite
  const suites = [ suite ]

  /*!
   * Listen for pre-requires to a specific file.
   */
  suite.on('pre-require', function () {
    /**
     * ### suite (fn)
     *
     * Define a new suite. Note that suites
     * can not be nested. A suite can contain
     * have it's options `set` as well as
     * infinitely defined benches.
     *
     * @param {Function} suite definition
     * @api public
     * @name suite
     */
    function suiteMount (title, fn) {
      var suite = new Suite(title, suites[0])
      suites.unshift(suite)
      _interface.unmount('suite')
      fn()
      suites.shift(suite)
      _interface.mount('suite', suiteMount)
    }

    _interface.mount('suite', suiteMount)

    /**
     * ### set (key, value)
     *
     * Set an option for the current suite.
     *
     * @param {String} key
     * @param {Mixed} value
     * @api public
     * @name set
     */
    _interface.mount('set', function (key, value) {
      suites[0].setOption(key, value)
    })

    /**
     * ### before (fn)
     *
     * A function that should be run before
     * the current suite.
     *
     * @param {Function} before function
     * @api public
     * @name before
     */
    _interface.mount('before', function (fn) {
      suites[0].addBefore(fn)
    })

    /**
     * ### after (fn)
     *
     * A function that should be run after
     * the current suite.
     *
     * @param {Function} after function
     * @api public
     * @name after
     */
    _interface.mount('after', function (fn) {
      suites[0].addAfter(fn)
    })

    /**
     * ### bench (fn)
     *
     * Define a new bench function.
     *
     * @param {Function} bench definition
     * @api public
     * @name bench
     */
    _interface.mount('bench', function (title, fn) {
      suites[0].addBench(new Bench(title, fn))
    })

    /**
     * ### xsuite (fn)
     *
     * Helper to temporarily disable a suite.
     *
     * @api public
     * @name xsuite
     */
    _interface.mount('xsuite', function () {})

    /**
     * ### xbench (fn)
     *
     * Helper to temporarily disable a bench.
     *
     * @api public
     * @name xbench
     */
    _interface.mount('xbench', function () {})
  })
}
