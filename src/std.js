export const global = function() {
	"use strict";
	let get = eval;
	return get("this");
}();
export const requestAnimationFrame = global.requestAnimationFrame;
export const cancelAnimationFrame = global.cancelAnimationFrame;
export const performance = global.performance;
export const setTimeout = global.setTimeout;