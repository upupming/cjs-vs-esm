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

## Ref

1. https://stackoverflow.com/a/31142842/8242705
2. https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c
