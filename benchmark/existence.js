import { suite, bench, set, after, before } from "../src/index.js";

suite("existence", () => {
  set("mintime", 1000);
  var foo = { c: "hey" };

  var bar = { __proto__: foo, b: "hey" };

  var obj = { __proto__: bar, a: "hey" };

  before(async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  });

  after(async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  });

  bench("'bar' in foo", () => {
    "a" in obj;
    "b" in obj;
    "c" in obj;
  });

  bench("foo.prop", () => {
    obj.a;
    obj.b;
    obj.c;
  });

  bench("foo.hasOwnProperty()", () => {
    obj.hasOwnProperty("a");
    obj.hasOwnProperty("b");
    obj.hasOwnProperty("c");
  });
});
