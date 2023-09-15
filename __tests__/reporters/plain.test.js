import { describe, expect, test } from "vitest";

import { EventEmitter } from "events";

import { plain } from "../../src/reporters/plain.js";

class FakeRunner extends EventEmitter {
  constructor() {
    super();

    this.output = [];
  }

  log(_log) {
    this.output.push(_log);
  }
}

describe("@reporters/plain", () => {
  test("should be able to output simple benchmark report", () => {
    expect.assertions(1);

    const runner = new FakeRunner();

    plain(runner);

    runner.emit("start");
    runner.emit("suite start", {
      title: "foo",
    });
    runner.emit("bench start", {
      title: "foo-child",
    });
    runner.emit("bench end", {
      ops: 12702222,
    });
    runner.emit("suite end");
    runner.emit("end", {
      suites: 1,
      benches: 1,
      elapsed: 1816.519502,
    });

    expect(runner.output).toEqual([
      "",
      "foo",
      "12,702,222 op/s",
      "",
      "Suites:  1",
      "Benches: 1",
      "Elapsed: 1,816.52 ms",
    ]);
  });
});
