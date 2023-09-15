export function json(runner) {
  var curSuite = null;
  var curBench = null;
  var isFirstRun = true;
  var jsonOutput = "";

  runner.on("start", function () {
    jsonOutput += '{"runs":[';
  });

  runner.on("end", function (stats) {
    jsonOutput += '],\n"stats":' + JSON.stringify(stats) + "}";

    runner.log(jsonOutput);
  });

  runner.on("suite start", function (suite) {
    curSuite = suite.title;
  });

  runner.on("bench start", function (bench) {
    curBench = bench.title;
  });

  runner.on("bench end", function (results) {
    jsonOutput +=
      (isFirstRun ? "" : ",") +
      JSON.stringify({
        suite: curSuite,
        bench: curBench,
        results: results,
      });

    isFirstRun = false;
  });
}
