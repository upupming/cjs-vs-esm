# Comparison of cjs vs esm

```js
// plugin-cjs.js

module.exports = function () { }
module.exports.foo = 'foo'
module.exports.bar = 'bar'
module.exports.update = function () {
    foo = 'bar';
}

```

```js
// plugin-esm.mjs

export var foo = 'foo'
export var bar = 'bar'
export default function fn() { }
export function update() {
    foo = 'bar';
}

```

```js
// main.mjs

// ===== ESM test ====
import * as pluginESMAll from './plugin-esm.mjs';

console.log('pluginESMAll', pluginESMAll)

import pluginESMDefault from './plugin-esm.mjs';

console.log('pluginESMDefault', pluginESMDefault)

// ===== CJS test ====
import * as pluginCJSAll from './plugin-cjs.js';

console.log('pluginCJSAll', pluginCJSAll)

import pluginCJSDefault from './plugin-cjs.js';

console.log('pluginCJSDefault', pluginCJSDefault)


// ===== Live binging test ====

// Live binding import/export in ESM
console.log('foo before esm update', pluginESMAll.foo)
pluginESMAll.update()
console.log('foo after esm update', pluginESMAll.foo)

// No live binding in CJS
console.log('foo before cjs update', pluginCJSDefault.foo)
pluginCJSDefault.update()
console.log('foo after cjs update', pluginCJSDefault.foo)

```

Output:

```bash
❯ node main.mjs
# import * as pluginESMAll from './plugin-esm.mjs';
# You can see all export & default are imported
pluginESMAll [Module: null prototype] {
  bar: 'bar',
  default: [Function: fn],
  foo: 'foo',
  update: [Function: update]
}
# import pluginESMDefault from './plugin-esm.mjs';
# You can see only default are imported
pluginESMDefault [Function: fn]
# import * as pluginCJSAll from './plugin-cjs.js';
# You can see all export & default are imported, and `pluginCJSAll` is a object
# The default import is derived from `module.exports` object, which is a function but also has `foo`, `bar` and `update` field
pluginCJSAll [Module: null prototype] {
  bar: 'bar',
  default: [Function (anonymous)] {
    foo: 'foo',
    bar: 'bar',
    update: [Function (anonymous)]
  },
  foo: 'foo',
  update: [Function (anonymous)]
}
# import pluginCJSDefault from './plugin-cjs.js';
# Only got the default derived from `module.exports` object, and `pluginCJSDefault` is a function (the `module.exports` object)
pluginCJSDefault [Function (anonymous)] {
  foo: 'foo',
  bar: 'bar',
  update: [Function (anonymous)]
}
# ESM support live binding, but CJS make copies of variables
foo before esm update foo
foo after esm update bar
foo before cjs update foo
foo after cjs update foo
```

So if you library is CJS package, the best way is to use multiple `exports.xxx`:

```js
exports.useMemo = useMemo
```

In this way, when consumer is using ESM, both `import *` and `import default` will got a object with `useMemo` field.

But when you want to export a function, you can just do some thing like this (copied from https://github.com/tj/co/blob/249bbdc72da24ae44076afd716349d2089b31c4c/index.js#L12):

```js
module.exports = co['default'] = co.co = co;
```

## Pitfalls

The ES6 modules spec states that a namespace import (import * as x) can only be an object, but CJS don't has this limitation when doing module.exports = xxx, this is why TS introduces `esModuleInterop`

Note `esModuleInterop` is about how compiling ESM to CJS works, not about how import CJS to ESM works, which are two opposite directions. Please see https://stackoverflow.com/a/56348146/8242705

With `esModuleInterop` set to true:

```ts
// index.ts file in our app
import * as moment from 'moment'
// compiled to js:
// const moment = __importStar(require("moment"));
// Cannot do this because when `esModuleInterop` is true, TS now follow the ES6 modules spec, and moment can only be an object, but not callable
/* @ts-expect-error */
console.log(moment())
// this is okay
console.log(moment.default())

import moment1 from 'moment'
console.log(moment1())

// compiled to js:
// const moment1 = __importDefault(require('moment'));
// moment1.default();
```

```js
// may assign a function to `default` and call later
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// copy all fields in `mod` to result, and `mod` to result['default']
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
```

## Ref

1. https://stackoverflow.com/a/31142842/8242705
2. https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c
3. https://www.typescriptlang.org/tsconfig#esModuleInterop
4. https://stackoverflow.com/a/56348146/8242705
