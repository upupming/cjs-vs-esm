// index.ts file in our app
import * as moment from 'moment'
/* @ts-expect-error */
console.log(moment())
console.log(moment.default())

import moment1 from 'moment'
console.log(moment1())
