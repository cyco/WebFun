export const global = function() {
	"use strict";
	let get = eval;
	return get("this");
}();
export const setTimeout = global.setTimeout;
export const console = global.console;
export const Array = global.Array;
export const Promise = global.Promise;

export const requestAnimationFrame = global.requestAnimationFrame;
export const cancelAnimationFrame = global.cancelAnimationFrame;
export const performance = global.performance;
