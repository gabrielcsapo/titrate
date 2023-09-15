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

export function popSuite() {
  currentSuite = suites.pop();
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

export function xsuite() {
  // This can remain empty as it's just a helper for skipping suites.
}

export function xbench() {
  // This can remain empty as it's just a helper for skipping benches.
}
