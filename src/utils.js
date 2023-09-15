/**
 * .series (item[, delay], iterator[, done])
 *
 * Invoke an iterator for each emit in an array.
 * An optional delay can be placed in-between the
 * each item's invokation.
 * @method series
 * @param  {Array}    item
 * @param  {Number}   delay    in ms (optional)
 * @param  {[type]}   iterator [item, next]
 */
export async function series(item, delay, iterator) {
  if ("function" === typeof delay) {
    iterator = delay;
    delay = 0;
  }

  async function iterate(i) {
    var fn = item[i];
    if (!fn) return;
    await iterator(fn);

    await new Promise(async (resolve) => {
      if (!delay) {
        await iterate(++i);
        resolve();
      }
      setTimeout(async function () {
        await iterate(++i);
        resolve();
      }, delay);
    });
  }

  await iterate(0);
}

/**
 * turns a millesecond number to a human readable string
 * @method humanize
 * @param  {Number} n a millesecond number
 * @return {String} human readable string
 */
export function humanize(n) {
  var n = String(n).split(".");
  n[0] = n[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  return n.join(".");
}

export const cursor = {
  hide: function () {
    process.stdout.write("\x1b[?25l");
  },
  show: function () {
    process.stdout.write("\x1b[?25h");
  },
  deleteLine: function () {
    process.stdout.write("\x1b[2K");
  },
  beginningOfLine: function () {
    process.stdout.write("\x1b[0G");
  },
  CR: function () {
    cursor.deleteLine();
    cursor.beginningOfLine();
  },
};
