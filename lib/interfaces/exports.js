const Suite = require('../suite')
const Bench = require('../bench')

module.exports = function ({ suite }) {
  const suites = [ suite ]

  /*!
   * Listen for require with given spec
   */
  suite.on('require', function (spec) {
    /*!
     * setOptions
     *
     * Set options based on the `options`
     * object for a given suite.
     *
     * @api private
     */
    function setOptions (suite, opts) {
      for (var key in opts) {
        suite.setOption(key, opts[key])
      }
    }

    /*!
     * setBefore
     *
     * Set before functions based on function
     * or array of functions for a given suite.
     *
     * @api private
     */
    function setBefore (suite, before) {
      if (!Array.isArray(before)) before = [ before ]
      before.forEach(suite.addBefore.bind(suite))
    }

    /*!
     * setAfter
     *
     * Set functions based on function
     * or array of functions for a given suite.
     *
     * @api private
     */
    function setAfter (suite, after) {
      if (!Array.isArray(after)) after = [ after ]
      after.forEach(suite.addAfter.bind(suite))
    }

    /*!
     * setBench
     *
     * Set benches based on benches object
     * of attributed functions for a given suite.
     *
     * @api private
     */
    function setBench (suite, benches) {
      for (var title in benches) {
        suite.addBench(new Bench(title, benches[title]))
      }
    }

    /*!
     * Parse the incoming file
     */
    for (var _suite in spec) {
      const suite = new Suite(_suite, suites[0])
      const def = spec[_suite]

      if (def.options) setOptions(suite, def.options)
      if (def.before) setBefore(suite, def.before)
      if (def.after) setAfter(suite, def.after)
      if (def.bench) setBench(suite, def.bench)
    }
  })
}
