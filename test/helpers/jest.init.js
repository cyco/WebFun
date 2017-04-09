import 'jasmine-expect';
import './polyfill';
import './matchers';

import '/extension';
import '/util';

/*
import { srand, rand, randmod } from '/util';

srand(0x0711);
for (let i=0; i < 100; i++) {
	console.log(`testWorld(0x${rand().toString(0x10)}, ${1+randmod(3)}, ${1+randmod(3)})`);
}
//*/

global.mustBeWritten = true;