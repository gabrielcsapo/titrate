import { EventEmitter } from "events";

export default class Suite extends EventEmitter {
  /**
   * Creates a new suite and add it to a given parent. Used
   * by interfaces.
   * @method constructor
   * @param  {String}    title  [description]
   * @param  {function}  fn - function that is associated with the suite
   * @param  {[Suite]}    parent [description]
   */
  constructor(title, fn, parent) {
    super();

    this.title = title || "";
    this.fn = fn;
    this.benches = [];
    this.suites = [];
    this.before = [];
    this.after = [];
    this.options = {
      type: "adaptive",
      iterations: 100,
      concurrency: 1,
      mintime: 500,
      delay: 100,
    };

    if (parent) {
      parent.addSuite(this);
    }
  }

  /**
   * .addSuite (suite)
   *
   * Add another instance of a suite as a child
   * of the current suite.
   *
   * @param {Suite} constructed suite
   * @name addSuite
   * @api public
   */

  addSuite(suite) {
    suite.parent = this;
    this.suites.push(suite);
  }

  /**
   * .addBench (bench)
   *
   * Add a constructed bench as a child of the
   * current suite. Will use this suite's options
   * during it's run.
   *
   * @param {Bench} constructed benchmark
   * @name addBench
   * @api public
   */

  addBench(bench) {
    bench.parent = this;
    this.benches.push(bench);
  }

  /**
   * .setOption (key, value)
   *
   * Set an option of this suite to a given value.
   * All immediate children benches will use these
   * options.
   *
   * @param {String} key
   * @param {Mixed} value
   * @name setOption
   * @api public
   */

  setOption(key, value) {
    this.options[key] = value;
  }

  /**
   * .addBefore (fn)
   *
   * Add a function to be invoked before this suite
   * is ran. Can be async.
   *
   * @param {Function} function
   * @name addBefore
   * @api public
   */

  addBefore(fn) {
    this.before.push(fn);
  }

  /**
   * .addAfter (fn)
   *
   * Add a function to be invoked after this suite
   * is ran. Can be async.
   *
   * @param {Function} function
   * @name addAfter
   * @api public
   */

  addAfter(fn) {
    this.after.push(fn);
  }
}
