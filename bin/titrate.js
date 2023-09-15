#!/usr/bin/env node

import fastGlob from "fast-glob";
import path from "path";
import woof from "woof";

import Runner from "../src/runner.js";
import Reporters from "../src/reporters/index.js";
import { setCurrentSuite, getSuites } from "../src/index.js";

const version = "0.0.2";

const cli = woof(
  `
  Usage: titrate <options> <files>

  Options:
    -h, --help                           View titrate usage information
    -v, --version                        View titrate version
    -f, --files <comma,seperated,list>    Paths that match the files that are going to be benchmarked
    -r, --reporter [clean]               Specify the reporter to use (markdown, clean, csv, plain, json)

    Titrate (${version}) https://github.com/gabrielcsapo/titrate
`,
  {
    version,
    flags: {
      files: {
        type: "list",
        alias: "f",
        default: [],
      },
      reporter: {
        type: "string",
        alias: "r",
        default: "clean",
        validate: (reporter) => {
          return (
            ["html", "markdown", "clean", "csv", "plain", "json"].indexOf(
              reporter,
            ) > -1
          );
        },
      },
    },
  },
);

if (cli.error) {
  console.log(cli.error);

  process.exit(1);
}

runSuite(cli);

function runSuite({ files: _files, reporter: _reporter }) {
  const cwd = process.cwd();
  const files =
    _files.length > 0
      ? _files.map((file) => path.resolve(cwd, file))
      : fastGlob.sync(path.resolve(cwd, "benchmark", "**", "*.js"));

  const reporter = Reporters[_reporter];

  load(files)
    .then(() => {
      process.exit();
    })
    .catch((ex) => {
      console.log();
      console.log("Error found while running suite", ex.stack);
      process.exit(1);
    });

  async function load(files) {
    for (const file of files) {
      await import(file);
    }

    for (const s of getSuites()) {
      setCurrentSuite(s);
      s.fn();
      await run(s);
    }
  }

  async function run(suite) {
    return new Promise((resolve, reject) => {
      var runner = new Runner(suite);
      reporter(runner);
      runner.run(() => {
        resolve();
      });
    });
  }
}
