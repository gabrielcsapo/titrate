import { suite, bench } from "../src/index.js";

suite.skip("not yet implemented", () => {
  bench("Array.prototype.slice", () => {
    throw new Error("should not run");
  });
});

suite("kind of implemented", () => {
  bench.skip("Array.prototype.slice", () => {
    throw new Error("should not run");
  });
});
