export function csv(runner) {
  let curSuite = null;
  let curBench = null;

  runner.on("start", function () {
    runner.log("suite, bench, elapsed, iterations, ops");
  });

  runner.on("suite start", function (suite) {
    curSuite = suite.title;
  });

  runner.on("bench start", function (bench) {
    curBench = bench.title;
  });

  runner.on("bench end", function (results) {
    runner.log(
      curSuite +
        "," +
        curBench +
        "," +
        results.elapsed.toFixed(6) +
        "," +
        results.iterations +
        "," +
        results.ops.toFixed(0),
    );
  });
}
