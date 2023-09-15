import chalk from "chalk";

import { humanize, cursor } from "../utils.js";

function padBefore(str, width) {
  return Array(width - str.length).join(" ") + str;
}

export function clean(runner) {
  runner.on("start", function () {
    runner.log("");
  });

  runner.on("end", function (stats) {
    runner.log(chalk.grey("  Suites:  ") + stats.suites);
    runner.log(chalk.grey("  Benches: ") + stats.benches);
    runner.log(
      chalk.grey("  Elapsed: ") + humanize(stats.elapsed.toFixed(2)) + " ms",
    );
    runner.log("");
  });

  runner.on("suite start", function (suite) {
    runner.log(chalk.grey("  Suite: ") + suite.title);
    runner.log("");
  });

  runner.on("suite end", function (suite) {
    runner.log("");
  });

  runner.on("bench start", function (bench) {
    if (process.stdout) {
      process.stdout.write(
        "\r" + chalk.yellow(padBefore("wait » ", 25)) + chalk.grey(bench.title),
      );
    }
  });

  runner.on("bench end", function (results) {
    const ops = humanize(results.ops.toFixed(0));

    cursor.CR();

    runner.log(
      chalk.cyan(padBefore(ops + " op/s", 22)) +
        chalk.grey(" » " + results.title),
    );
  });
}
