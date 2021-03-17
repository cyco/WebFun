import addMatchers from "add-matchers";

const isNativeClass = (thing: any) =>
	typeof thing === "function" &&
	thing.hasOwnProperty("prototype") &&
	!thing.hasOwnProperty("arguments");

addMatchers({
	toBeClass: isNativeClass,
	toBeAClass: isNativeClass
});

declare global {
	namespace jasmine {
		interface Matchers<T> {
			toBeClass(): boolean;
			toBeAClass(): boolean;
		}
	}
}
