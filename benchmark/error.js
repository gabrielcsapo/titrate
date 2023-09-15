import { suite, bench } from "../src/index.js";

suite("error", function () {
  bench("Array.prototype.slice", function () {
    throw new Error("Oh no!");
  });
});
