import { describe, expect, test } from "vitest";

import { humanize } from "../src/utils.js";

describe("@utils", () => {
  describe("@humanize", () => {
    test("should be able to resolve milliseconds to a human readable number", () => {
      expect.assertions(1);

      const humanized = humanize(12614806);

      expect(humanized).toBe("12,614,806");
    });
  });
});
