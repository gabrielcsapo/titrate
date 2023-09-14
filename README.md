# titrate

> 🧪 mixing benchmarks into your workflow

[![Npm Version](https://img.shields.io/npm/v/titrate.svg)](https://www.npmjs.com/package/titrate)
[![npm](https://img.shields.io/npm/dt/titrate.svg)]()
[![npm](https://img.shields.io/npm/dm/titrate.svg)]()

## Installation

```
npm install titrate --save-dev
```

## Usage

```
Usage: titrate <options> <files>

Options:
  -h, --help                           View titrate usage information
  -v, --version                        View titrate version
  -f, --files <comma,seperated,list>    Paths that match the files that are going to be benchmarked
  -r, --reporter [clean]               Specify the reporter to use (markdown, clean, csv, plain, json)
  -i, --interface [bdd]                Specify the interface to expect (bdd, exports)

  Titrate (0.0.0) https://github.com/gabrielcsapo/titrate
```

## Writing Async Benchmarks

Though suites/benches are executed serially, the benches themselves can be asyncronous. Furthermore, suites ran with the titrate command line runner have a number of globals to simplify bench definitions. Take the following code, for example:

```js
suite("Make Tea", function () {
  var tea = new CupOfTea("green");

  bench("boil water", function (next) {
    tea.boil("85℃", function (err, h20) {
      // perfect temperature!
      next();
    });
  });

  // add tea, pour, ...
  bench("sip tea", function () {
    tea.sip("mmmm");
  });
});
```

#### Async vs. Sync

Since boiling water takes time, a `next` function was provided to each iteration in our bench to be called when the async function completes. Since the consumption of tea provides instant gratification, no `next` needed to be provided, even though we still wish to measure it.

#### Setup/Teardown

Arbitrary functions may be specified for setup or teardown for each suite by using the `before` and `after` keywords. These function may be sync or async.

```js
suite("DB", function () {
  before(function (next) {
    db.connect("localhost:9090", next);
  });

  bench(function (next) {
    // ...
  });

  after(function () {
    db.close();
  });
});
```

#### Setting Options

As not all code is equal, we need a way to change the running conditions for our benches. Options can currently be changed for
any given suite, and will be retained for any nested suites or benches of that suite.

To set an option:

```js
suite("Make Tea", function () {
  set("iterations", 10000);
  set("type", "static");
  // ...
});
```

##### Defaults

Here are all available options and the default values:

```js
set("iterations", 100); // the number of times to run a given bench
set("concurrency", 1); // the number of how many times a given bench is run concurrently
set("type", "adaptive"); // or 'static' (see below)
set("mintime", 500); // when adaptive, the minimum time in ms a bench should run
set("delay", 100); // time in ms between each bench
```

##### Static vs Adaptive

There are two modes for running your benches: 'static' and 'adaptive'. Static mode will run exactly the set number of iterations.
Adaptive will run the set iterations, then if a minimal time elapsed has not passed, will run more another set of iterations, then
check again (and repeat) until the requirement has been satisfied.

## Running Benchmarks

Running of your benchmarks is provided through `./bin/titrate`. The recommended approach is to add a devDependancy in your `package.json` and then add a line to a `Makefile` or build tool. The `titrate` bin will accept a list of files to load or will look in the current working directory for a folder named `benchmark` and load all files.

```
$ tirate --files=suite1.js,suite2.js
```

## Options

```
  -h, --help                           View titrate usage information
  -v, --version                        View titrate version
  -f, --files <comma,seperated,list>   Paths that match the files that are going to be benchmarked
  -r, --reporter [clean]               Specify the reporter to use (markdown, clean, csv, plain, json)
  -i, --interface [bdd]                Specify the interface to expect (bdd, exports)
```

#### -i, --interface <name>

The --interface option lets you specify the interface to use, defaulting to "bdd".

#### -r, --reporter <name>

The --reporter option allows you to specify the reporter that will be used, defaulting to "clean".

### Interfaces

Titrate "interface" system allows developers to choose their style of DSL. Shipping with bdd, and exports flavoured interfaces.

#### bdd

```js
suite("suite name", function () {
  set("iterations", 10);

  bench("bench name", function (done) {
    some_fn(done);
  });
});
```

#### exports

```js
exports["suite name"] = {
  options: {
    iterations: 10,
  },
  bench: {
    "bench name": function (done) {
      some_fn(done);
    },
  },
};
```

### Reporters

- json (outputs information in json format)
- clean (Good-looking default reporter with colors on the terminal screen)
- plain (Similar to _clean_ reporter but without colors and other ANSI sequences.)
- csv (Completely different, create csv formated rows for later processing.)
- markdown (Creates markdown output)
