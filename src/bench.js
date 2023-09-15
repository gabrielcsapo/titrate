import { EventEmitter } from "events";

import Timer from "./timer.js";

/*!
 * runStatic (timer, cb)
 *
 * Run this bench as  static (set iterations).
 *
 * @param {Function} callback
 * @api private
 */
async function runStatic(cb) {
  var parent = this.parent;
  var iterations = parent.options.iterations;
  var concurrency = parent.options.concurrency;
  var pending = iterations;
  var timer = new Timer();

  var runner = this.fn.length === 0 ? doSync : doAsync;

  function next(total) {
    cb(total, timer.stop().elapsed);
  }

  this.emit("start");
  timer.start();
  await runner(this.fn, pending, concurrency, next);
}

/*!
 * runStatic (timer, cb)
 *
 * Run this bench as adaptive: minimum
 * iterations then scale up to meet minimum
 * time frame.
 *
 * @param {Function} callback
 * @api private
 */
function runAdaptive(cb) {
  var self = this;

  var parent = this.parent;

  var duration = parent.options.mintime;

  var iterations = parent.options.iterations;

  var concurrency = parent.options.concurrency;

  var pending = iterations;

  var timer = new Timer();

  var total = 0;

  var runner = this.fn.length === 0 ? doSync : doAsync;

  function next(count) {
    total += count;
    if (timer.stop().elapsed < duration) {
      var pending = Math.round(count * (duration / (timer.elapsed + 1)));
      runner(self.fn, pending, concurrency, next);
    } else {
      cb(total, timer.elapsed);
    }
  }

  this.emit("start");
  timer.start();
  runner(this.fn, pending, concurrency, next);
}

/*!
 * doSync (fn, iterations, next)
 *
 * Run a syncronous bench function
 * a set number of iterations.
 *
 * @param {Function} bench function
 * @param {Number} iterations
 * @param {Function} callback when done
 * @api private
 */
function doSync(fn, iterations, concurrency, next) {
  var i = iterations;
  while (i--) {
    fn();
  }
  next(iterations);
}

/*!
 * doAsync (fn, iterations, next)
 *
 * Run an asynchronous bench function
 * a set number of iterations.
 *
 * @param {Function} bench function
 * @param {Number} iterations
 * @param {Function} callback when done
 * @api private
 */
async function doAsync(fn, iterations, concurrency, next) {
  let pending;
  var running = (pending = iterations);

  async function iterate() {
    if (!pending) return next(iterations);
    if (!running) return;
    --running;
    await fn(function () {
      --pending;
      iterate();
    });
  }

  for (var i = 0; i < concurrency; ++i) {
    await iterate();
  }
}

class Bench extends EventEmitter {
  constructor(title, fn) {
    super();

    this.title = title;
    this.fn = fn;
  }

  /**
   * Run a bench.
   * @method run
   * @param  {Function} cb callback
   */
  async run() {
    return await new Promise(async (resolve) => {
      var self = this;

      var opts = this.parent.options;

      var runner = opts.type === "static" ? runStatic : runAdaptive;

      function report(total, elapsed) {
        var stats = {
          iterations: total,
          elapsed: elapsed,
          title: self.title,
          ops: Math.round((total / elapsed) * 1000),
        };
        self.stats = stats;
        self.emit("end", stats);

        resolve(stats);
      }

      await runner.call(this, report);
    });
  }
}

export default Bench;
