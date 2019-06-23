import addMatchers from "add-matchers";

addMatchers({
	toHaveClass: (received, actual) => actual.classList.contains(received)
});

declare global {
	namespace jasmine {
		interface Matchers<T> {
			toHaveClass(className: string): boolean;
		}
	}
}
