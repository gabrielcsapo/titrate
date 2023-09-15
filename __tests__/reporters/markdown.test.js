import { describe, expect, test } from "vitest";

import { EventEmitter } from "events";

import { markdown } from "../../src/reporters/markdown.js";

class FakeRunner extends EventEmitter {
  constructor() {
    super();

    this.output = [];
  }

  log(_log) {
    this.output.push(_log);
  }
}

describe("@reporters/markdown", () => {
  test("should be able to output simple benchmark report", () => {
    expect.assertions(1);

    const runner = new FakeRunner();

    markdown(runner);

    runner.emit("start");
    runner.emit("suite start", {
      title: "foo",
    });
    runner.emit("bench start", {
      title: "foo-child",
    });
    runner.emit("bench end", {
      iterations: 8453882,
      elapsed: 678.7734989999999,
      title: "Array.prototype.slice",
      ops: 12454644,
    });
    runner.emit("suite end", {
      benches: [],
    });
    runner.emit("end", {
      suites: 1,
      benches: 1,
      elapsed: 1816.519502,
    });

    expect(runner.output).toEqual([
      "",
      "# foo",
      "",
      "## Array.prototype.slice\n```\n12,454,644 op/s\n```\n",
      "",
      "# Suites:  1",
      "# Benches: 1",
      "# Elapsed: 1,816.52 ms",
    ]);
  });
});
