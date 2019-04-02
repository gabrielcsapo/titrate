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
 * @param  {Function} done     on completion (optional)
 */
function series(item, delay, iterator, done) {
  if ('function' ===  typeof delay) {
    done = iterator;
    iterator = delay;
    delay = 0;
  }

  done = done || function() {};

  function iterate(i) {
    var fn = item[i];
    if (!fn) return done();
    iterator(fn, function cb(err) {
      if (err) return done(err);
      if (!delay) return iterate(++i);
      setTimeout(function() {
        iterate(++i);
      }, delay);
    });
  };

  iterate(0);
};

/**
 * turns a millesecond number to a human readable string
 * @method humanize
 * @param  {Number} n a millesecond number
 * @return {String} human readable string
 */
function humanize(n) {
  var n = String(n).split('.')
  n[0] = n[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
  return n.join('.')
};

const cursor = {
  hide: function() {
    process.stdout.write('\033[?25l');
  },
  show: function() {
    process.stdout.write('\033[?25h');
  },
  deleteLine: function() {
    process.stdout.write('\033[2K');
  },
  beginningOfLine: function() {
    process.stdout.write('\033[0G');
  },
  CR: function() {
    cursor.deleteLine();
    cursor.beginningOfLine();
  },
};

module.exports = {
  cursor,
  series,
  humanize,
}
