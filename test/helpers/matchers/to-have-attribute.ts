import addMatchers from "add-matchers";

addMatchers({
	toHaveAttribute: (received, actual) => actual.hasAttribute(received)
});

declare global {
	namespace jasmine {
		interface Matchers<T> {
			toHaveAttribute(attribute: string): boolean;
		}
	}
}
