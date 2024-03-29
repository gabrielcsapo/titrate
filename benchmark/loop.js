import { suite, bench } from "../src/index.js";

suite("array loop", () => {
  var arr = [1, 2, 3, 4, 5, 6];

  bench("foo.forEach", () => {
    var s = 0;
    arr.forEach(function (n) {
      s = s + n;
    });
  });

  bench("for i in foo", () => {
    var s = 0;
    for (var i in arr) {
      s = s + arr[i];
    }
  });

  bench("for count", () => {
    var s = 0;
    for (var i = 0; i < arr.length; i++) {
      s = s + arr[i];
    }
  });
});
