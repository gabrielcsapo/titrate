import { suite, set, bench, before, after } from "../src/index.js";

var nextTick = setImmediate || process.nextTick;

var bef = false;
var aft = false;

suite("async", () => {
  set("mintime", 2000);

  before(async () => {
    await new Promise((resolve) => {
      setTimeout(() => {
        bef = true;
        resolve();
      }, 1000);
    });
  });

  bench("setImmediate || nextTick", async () => {
    await new Promise((resolve) => {
      nextTick(resolve);
    });
  });

  bench("setTimeout 1", async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 1);
    });
  });

  after(() => {
    aft = true;
  });
});

process.on("exit", () => {
  if (!bef) throw new Error("before did not run");
  if (!aft) throw new Error("after did not run");
});
