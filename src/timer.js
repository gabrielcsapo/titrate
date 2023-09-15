export default class Timer {
  /**
   * Constructs a timer that will return an elapsed calculation.
   *
   * @method constructor
   */
  constructor() {
    this._start = null;
    this._elapsed = null;
  }

  /**
   * Mark the starting point for this timer.
   * @method start
   */
  start() {
    this._start = process.hrtime();

    return this;
  }

  /**
   * Mark the stopping point for this timer.
   * @method stop
   */
  stop() {
    this._elapsed = process.hrtime(this._start);

    return this;
  }

  /**
   * Calculate the milliseconds elapsed time.
   * @method elapsed
   * @return {Number} ms elapsed since start
   */
  get elapsed() {
    if (!this._elapsed) return null;
    var el = this._elapsed;
    return el[0] * 1000 + el[1] / 1000 / 1000;
  }
}
