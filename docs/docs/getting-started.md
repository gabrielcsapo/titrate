---
sidebar_position: 1
---

# Getting Started

Install titrate using your favorite package manager.

```shell
npm install --save-dev titrate
```

Let's get started with a basic benchmarking test. Create `type.js` file:

```js
import { suite, bench, set } from "titrate";

suite("array type", () => {
  set("iterations", 2000000);

  var arr = [];

  bench("Array.isArray", () => {
    var isArray = Array.isArray(arr);
  });

  bench("Object.prototype.toString.call", () => {
    var isArray = Object.prototype.toString.call(arr) === "[object Array]";
  });
});
```

Now run `titrate -f type.js` and titrate will print the following message:

![Titrate example for type](/img/type-benchmark.png)
