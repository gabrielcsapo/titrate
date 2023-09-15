export function html(runner) {
  let htmlContent = "";

  runner.on("start", function () {
    htmlContent += "<div><br></div>";
  });

  runner.on("end", function (stats) {
    htmlContent += `<div style="color: grey;">Suites: ${stats.suites}<br>`;
    htmlContent += `Benches: ${stats.benches}<br>`;
    htmlContent += `Elapsed: ${stats.elapsed.toFixed(2)} ms<br></div>`;

    runner.log(htmlContent);
  });

  runner.on("suite start", function (suite) {
    htmlContent += `<div style="color: grey;">Suite: ${suite.title}<br></div>`;
  });

  runner.on("suite end", function (suite) {
    htmlContent += "<br>";
  });

  runner.on("bench start", function (bench) {
    // This one is tricky since you were overwriting terminal content.
    // Let's just add it to the HTML content for now.
    htmlContent += `<span style="color: yellow;">wait » </span><span style="color: grey;">${bench.title}</span>`;
  });

  runner.on("bench end", function (results) {
    const ops = results.ops.toFixed(0);
    htmlContent += `<div style="color: cyan;">${ops} op/s » <span style="color: grey;">${results.title}</span></div>`;
  });
}
