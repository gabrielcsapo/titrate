import { humanize } from "../utils.js";

function pad(str, width) {
  str = str.substr(0, width - 3);
  return str + " " + Array(width - str.length - 2).join(".") + " ";
}

export function plain(runner) {
  runner.on("start", function () {
    runner.log("");
  });

  runner.on("end", function (stats) {
    runner.log("Suites:  " + stats.suites);
    runner.log("Benches: " + stats.benches);
    runner.log("Elapsed: " + humanize(stats.elapsed.toFixed(2)) + " ms");
  });

  runner.on("suite start", function (suite) {
    runner.log(suite.title);
  });

  runner.on("suite end", function (suite) {
    runner.log("");
  });

  runner.on("bench start", function (bench) {
    process.stdout.write("  " + pad(bench.title, 50));
  });

  runner.on("bench end", function (results) {
    runner.log(humanize(results.ops.toFixed(0)) + " op/s");
  });
}
