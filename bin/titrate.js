#!/usr/bin/env node

const glob = require('glob')
const path = require('path')
const fs = require('fs')
const woof = require('woof')

const Suite = require('../lib/suite');
const Runner = require('../lib/runner');
const Interface = require('../lib/interface');
const Reporters = require('../lib/reporters');
const { resolveBenchmarkFiles } = require('../lib/utils');

const { version } = require('../package.json')

const cli = woof(`
  Usage: titrate <options> <files>

  Options:
    -h, --help                           View titrate usage information
    -v, --version                        View titrate version
    -f, --files <comma,seperated,list>    Paths that match the files that are going to be benchmarked
    -r, --reporter [clean]               Specify the reporter to use (markdown, clean, csv, plain, json)
    -i, --interface [bdd]                Specify the interface to expect (bdd, exports)

    Titrate (${version}) https://github.com/gabrielcsapo/titrate
`, {
  version,
  flags: {
    interface: {
      type: 'string',
      default: 'bdd',
      validate: (reporter) => {
        return ['bdd', 'exports'].indexOf(reporter) > -1
      }
    },
    files: {
      type: 'list',
      alias: 'f',
      default: [],
    },
    reporter: {
      type: 'string',
      alias: 'r',
      default: 'clean',
      validate: (reporter) => {
        return ['markdown', 'clean', 'csv', 'plain', 'json'].indexOf(reporter) > -1
      }
    }
  }
});

if(cli.error) {
  console.log(cli.error);

  process.exit(1);
}

runSuite(cli)

function runSuite ({ files: _files, interface, reporter: _reporter }) {
  const cwd = process.cwd();
  const files = _files.length > 0 ?
    _files.map((file) => require.resolve(path.resolve(process.cwd(), file)))
  :
    glob.sync(path.resolve(process.cwd(), 'benchmark', '**', '*.js'));

  const suite = new Suite()
  const ui = new Interface(suite, { style: interface })
  const reporter = Reporters[_reporter]

  load(files, function () {
    run(suite, process.exit);
  });

  function load (files, cb) {
    var after = files.length
    files.forEach(function (file) {
      delete require.cache[file];
      suite.emit('pre-require');
      suite.emit('require', require(file));
      --after || cb();
    });
  }

  function run (suite, cb) {
    var runner = new Runner(suite);
    reporter(runner)
    runner.run(cb);
  }
};
