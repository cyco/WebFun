import addMatchers from 'add-matchers';

const isNativeClass = (thing) => typeof thing === 'function' && thing.hasOwnProperty('prototype') && !thing.hasOwnProperty('arguments');

addMatchers({
	toBeClass: isNativeClass,
	toBeAClass: isNativeClass
});
