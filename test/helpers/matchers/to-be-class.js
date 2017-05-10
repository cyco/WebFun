import addMatchers from 'add-matchers';

const isNativeClass = (thing) => thing instanceof Function && thing.hasOwnProperty('prototype') && !thing.hasOwnProperty('arguments');

addMatchers({
	toBeClass: isNativeClass,
	toBeAClass: isNativeClass
});
