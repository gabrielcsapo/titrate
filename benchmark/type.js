import { suite, bench, set } from "../src/index.js";

suite("array type", () => {
  set("iterations", 2000000);

  var arr = [];

  bench("Array.isArray", () => {
    var isArray = Array.isArray(arr);
  });

  bench("Object.prototype.toString.call", () => {
    var isArray = Object.prototype.toString.call(arr) === "[object Array]";
  });
});
