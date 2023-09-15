import { suite, bench, set } from "../src/index.js";

var i = 0;

suite("single", () => {
  set("iterations", 1);
  set("type", "static");

  bench("i", () => {
    i++;
  });
});

process.on("exit", () => {
  if (i !== 1) throw new Error("single ran for " + i + " iterations");
});
