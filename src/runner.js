import { EventEmitter } from "events";

import Timer from "./timer.js";
import { series } from "./utils.js";

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
function proxy(from, to, ev) {
  from.on(ev, function () {
    var args = Array.prototype.slice.call(arguments);

    var event = [ev].concat(args);
    to.emit.apply(to, event);
  });
}

/*!
 * runHooks (hooks)
 *
 * Private function to handle the actual serial
 * running of hooks for before and after this
 * suite.
 *
 * @param {Array} hook functions
 * @api private
 */

async function runHooks(hooks) {
  await series(hooks, async function (fn) {
    await fn();
  });
}

class Runner extends EventEmitter {
  constructor(suite) {
    super();

    this.suite = suite;
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
   */
  async run() {
    var stats = (this.stats = { suites: 0, benches: 0 });

    async function iterator(fn) {
      await fn();
    }

    this.on("bench start", function () {
      stats.benches++;
    });

    this.on("suite start", function () {
      stats.suites++;
    });

    this.timer = new Timer().start();
    this.emit("start");

    await series(
      [
        this.runBefore.bind(this),
        this.runBenches.bind(this),
        this.runSuites.bind(this),
        this.runAfter.bind(this),
      ],
      iterator
    );

    stats.elapsed = this.timer.stop().elapsed;
    this.emit("end", stats);
  }

  /**
   * Will invoke the `.run` method of each
   * bench in this suite serially, taking into
   * account the delay option of the suite.
   * @method runBenches
   */
  async runBenches() {
    var stats = [];
    var suite = this.suite;
    var delay = suite.options.delay;

    this.emit("suite start", suite);

    await series(suite.benches, delay, async (bench) => {
      this.emit("bench start", bench);
      const res = await bench.run();
      stats.push(res);
      this.emit("bench end", res);
    });

    this.emit("suite end", suite);
    this.emit("suite results", stats);
  }

  /**
   * Will invoke the `.run` method of each
   * nested suite serially, taking into account
   * this suites delay between each suite.
   * @method runSuites
   */
  async runSuites() {
    var suite = this.suite;
    var delay = suite.options.delay;

    await series(suite.suites, delay, (suite, next) => {
      var runner = new Runner(suite);
      proxy(runner, this, "suite start");
      proxy(runner, this, "suite end");
      proxy(runner, this, "suite results");
      proxy(runner, this, "bench start");
      proxy(runner, this, "bench end");
      this.emit("suite start", suite);
      runner.run().then(() => {
        next();
      });
    });
  }

  /**
   * Will invoke each before hook of the current
   * suite serially. Will take into account async
   * and sync functions.
   * @method runBefore
   * @param  {Function} done
   */
  async runBefore() {
    await runHooks.call(this, this.suite.before);
  }

  /**
   * Will invoke each after hook of the current
   * suite serially. Will take into account async
   * and sync functions.
   * @method runAfter
   * @param  {Function} done
   */
  async runAfter() {
    await runHooks.call(this, this.suite.after);
  }

  /**
   * outputs to data to the console
   * @method log
   */
  log(data) {
    console.log(data);
  }
}

export default Runner;
