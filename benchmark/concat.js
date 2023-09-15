import { suite, set, bench } from "../src/index.js";

suite("array concat", () => {
  set("iterations", 10);

  var arr1 = ["a", "b", "c"];

  var arr2 = ["d", "e", "f"];

  bench("concat", () => {
    var arr3 = arr1.concat(arr2);
  });

  bench("for loop", () => {
    var l1 = arr1.length;

    var l2 = arr2.length;

    var arr3 = Array(l1 + l2);
    for (var i = 0; i < l1; i++) arr3[i] = arr1[i];
    for (var i2 = 0; i2 < l2; i2++) arr3[i + i2] = arr2[i2];
  });
});
