import { suite, bench } from "../src/index.js";

suite("1", () => {
  bench("hi 1", () => {});
});

suite("2", () => {
  bench("hi 2", () => {});
});
