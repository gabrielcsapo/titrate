import { humanize } from "../utils.js";

export function markdown(runner) {
  runner.on("end", function (stats) {
    runner.log("");
    runner.log("# Suites:  " + stats.suites);
    runner.log("# Benches: " + stats.benches);
    runner.log("# Elapsed: " + humanize(stats.elapsed.toFixed(2)) + " ms");
  });

  runner.on("suite start", function (suite) {
    runner.log("");
    runner.log("# " + suite.title);
    runner.log("");
  });

  runner.on("suite end", function (suite) {
    if (suite.benches.length > 1) {
      var benches = suite.benches
        .slice()
        .sort((a, b) => b.stats.ops - a.stats.ops);

      runner.log("");
      runner.log("# Fastest \n" + "```\n" + benches[0].title + "\n```");
    }
  });

  runner.on("bench end", function (results) {
    runner.log(
      "## " +
        results.title +
        "\n" +
        "```\n" +
        humanize(results.ops.toFixed(0)) +
        " op/s" +
        "\n```\n",
    );
  });
}
