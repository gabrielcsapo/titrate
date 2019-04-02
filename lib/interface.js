const interfaces = require('./interfaces')

/*!
 * mountApi ()
 *
 * Load the selected interface style and initialize
 * it for use with this interface.
 *
 * @api private
 */
function mountApi () {
  var style = this.style
  if (typeof style === 'function') {
    style(this)
  } else {
    var fn = interfaces[style]
    if (!fn) throw new Error('Unable to load interface \'' + style + '\'.')
    fn(this)
  }
}

/**
 * Interface (constructor)
 *
 * The Interface manager handles mounting
 * and unmounting of exposed interface functions
 * to the `global` or other mountpoint for a root
 * suite run.
 *
 * @param {Suite} root suite
 * @param {Object} options
 * @api public
 */
class Interface {
  constructor (suite, opts) {
    opts = opts || {}
    this.suite = suite
    this.style = opts.style || 'bdd'
    this.mountpoint = opts.mountpoint || global
    mountApi.call(this)
  }

  /**
   * .mount (point, function)
   *
   * Mount a function to a given point on the
   * current interface mount object (such as global).
   *
   * @param {String} mount point
   * @param {Function} callback function
   * @api public
   */
  mount (point, fn) {
    this.mountpoint[point] = fn
  }

  /**
   * .unmount (point)
   *
   * Unmount a given point on the current interface
   * mount object (such as global).
   *
   * @param {String} mount point
   * @api public
   */
  unmount (point) {
    delete this.mountpoint[point]
  }
}

module.exports = Interface
