import 'jasmine-expect';
import './polyfill';
import './matchers';

import '/extension';
import '/util';

import { srand, rand, randmod } from '/util';

/* 
// used seeds 0x0001
// used seeds 0x0002
// used seeds 0x0711
srand(0x0001);
for (let i=0; i < 100; i++) {
	console.log(`dumpWorld(0x${rand().toString(0x10)}, ${1+randmod(3)}, ${1+randmod(3)});`);
}
//*/

global.mustBeWritten = true;