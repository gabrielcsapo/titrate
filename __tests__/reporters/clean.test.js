import { describe, expect, test } from "vitest";

import { EventEmitter } from "events";

import { clean } from "../../src/reporters/clean.js";

class FakeRunner extends EventEmitter {
  constructor() {
    super();

    this.output = [];
  }

  log(_log) {
    this.output.push(_log);
  }
}

describe("@reporters/clean", () => {
  test("should be able to output simple benchmark report", () => {
    expect.assertions(1);

    const runner = new FakeRunner();

    clean(runner);

    runner.emit("start");
    runner.emit("suite start", {
      title: "foo",
    });
    runner.emit("bench start", {
      title: "foo-child",
    });
    runner.emit("bench end", {
      title: "foo",
      ops: 12702222,
    });
    runner.emit("suite end");
    runner.emit("end", {
      suites: 1,
      benches: 1,
      elapsed: 1816.519502,
    });

    expect(runner.output).toMatchInlineSnapshot(`
      [
        "",
        "[90m   Suite: [39mfoo",
        "",
        "[36m      12,702,222 op/s[39m[90m » foo[39m",
        "",
        "[90m  Suites:  [39m1",
        "[90m  Benches: [39m1",
        "[90m  Elapsed: [39m1,816.52 ms",
        "",
      ]
    `);
  });
});
