import { describe, expect, test } from "vitest";

import { EventEmitter } from "events";

import { csv } from "../../src/reporters/csv.js";

class FakeRunner extends EventEmitter {
  constructor() {
    super();

    this.output = [];
  }

  log(_log) {
    this.output.push(_log);
  }
}

describe("@reporters/csv", () => {
  test("should be able to output simple benchmark report", () => {
    expect.assertions(1);

    const runner = new FakeRunner();

    csv(runner);

    runner.emit("start");
    runner.emit("suite start", {
      title: "foo",
    });
    runner.emit("bench start", {
      title: "foo-child",
    });
    runner.emit("bench end", {
      iterations: 8154764,
      elapsed: 627.031966,
      title: "Array.prototype.slice",
      ops: 13005340,
    });
    runner.emit("suite end");
    runner.emit("end", {
      suites: 1,
      benches: 1,
      elapsed: 1816.519502,
    });

    expect(runner.output).toEqual([
      "suite, bench, elapsed, iterations, ops",
      "foo,foo-child,627.031966,8154764,13005340",
    ]);
  });
});
