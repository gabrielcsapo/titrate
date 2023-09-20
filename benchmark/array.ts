// @ts-ignore
import { suite, set, bench } from "../src/index.js";

suite("array slice", () => {
  set("iterations", 2000000);

  var arr = [1, 2, 3, 4, 5, 6];

  bench("Array.prototype.slice", () => {
    var args = Array.prototype.slice.call(arr, 1);
  });

  bench("for loop", () => {
    var args = new Array(arr.length - 1);
    for (var i = 1; i < arr.length; i++) args[i - 1] = arr[i];
  });
});
