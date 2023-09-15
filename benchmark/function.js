import { suite, bench } from "../src/index.js";

suite("function", () => {
  function foo() {}

  bench("foo()", () => {
    foo(1, 2, 3);
  });

  bench("foo.call", () => {
    foo.call(foo, 1, 2, 3);
  });

  bench("foo.apply", () => {
    foo.apply(foo, [1, 2, 3]);
  });
});
