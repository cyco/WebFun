import addMatchers from "add-matchers";

addMatchers({
	toBeInstanceOf: (received, actual) => actual instanceof received
});

declare global {
	namespace jasmine {
		interface Matchers<T> {
			toBeInstanceOf(thing: any): boolean;
		}
	}
}
