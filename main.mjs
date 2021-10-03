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
