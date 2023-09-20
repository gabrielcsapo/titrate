export function html(runner) {
  let htmlContent = "";

  runner.on("start", function () {
    htmlContent += "<div><br></div>";
  });

  runner.on("end", function (stats) {
    htmlContent += `<div style="color: grey;">Suites: ${stats.suites}<br>`;
    htmlContent += `Benches: ${stats.benches}<br>`;
    htmlContent += `Elapsed: ${stats.elapsed.toFixed(2)} ms<br/></div>`;

    runner.log(htmlContent);
  });

  runner.on("suite skipped", function (suite) {
    htmlContent += `<div style="color: yellow;">Suite: ${suite.title}<br/></div>`;
  });

  runner.on("suite start", function (suite) {
    htmlContent += `<div style="color: grey;">Suite: ${suite.title}<br/></div>`;
  });

  runner.on("suite end", function (suite) {
    htmlContent += "<br/>";
  });

  runner.on("bench skipped", function (results) {
    const ops = results.ops.toFixed(0);
    htmlContent += `<div style="color: yellow;">⊙ » ${results.title}</div>`;
  });

  runner.on("bench end", function (results) {
    const ops = results.ops.toFixed(0);
    htmlContent += `<div style="color: cyan;">${ops} op/s » <span style="color: grey;">${results.title}</span></div>`;
  });
}
