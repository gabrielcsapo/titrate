import Suite from "./suite.js";
import Bench from "./bench.js";

let currentSuite;
let suites = [];

export function suite(title, fn) {
  suites.push(new Suite(title, fn));
}

export function getSuites() {
  return suites;
}

export function setCurrentSuite(suite) {
  currentSuite = suite;
}

export function set(key, value) {
  currentSuite.setOption(key, value);
}

export function before(fn) {
  currentSuite.addBefore(fn);
}

export function after(fn) {
  currentSuite.addAfter(fn);
}

export function bench(title, fn) {
  currentSuite.addBench(new Bench(title, fn));
}

suite.skip = function (title, fn) {
  suites.push(new Suite(title, fn, true));
};

bench.skip = function (title, fn) {
  currentSuite.addBench(new Bench(title, fn, true));
};
