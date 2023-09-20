#!/usr/bin/env node

import fastGlob from "fast-glob";
import path from "path";
import woof from "woof";

import Suite from "../src/suite.js";
import Runner from "../src/runner.js";
import Reporters from "../src/reporters/index.js";
import { setCurrentSuite, getSuites } from "../src/index.js";

const version = "0.0.3";

const cli = woof(
  `
  Usage: titrate <options> <files>

  Options:
    -h, --help                           View titrate usage information
    -v, --version                        View titrate version
    -f, --files <comma,separated,list>   Paths that match the files that are going to be benchmarked (globs or exact paths)
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
  if (!_files) {
    throw new Error("titrate: please specify files with -f or --files.");
  }

  const cwd = process.cwd();
  const files = _files
    .map((file) => fastGlob.sync(path.resolve(cwd, file)))
    .flat();
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
    const collectionOfSuites = new Suite();

    for (const file of files) {
      await import(file);
    }

    for (const s of getSuites()) {
      setCurrentSuite(s);
      s.fn();

      collectionOfSuites.addSuite(s);
    }

    await run(collectionOfSuites);
  }

  async function run(suite) {
    var runner = new Runner(suite);
    reporter(runner);
    await runner.run();
  }
}
