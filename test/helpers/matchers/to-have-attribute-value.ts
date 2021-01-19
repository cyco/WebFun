import addMatchers from "add-matchers";

addMatchers({
	toHaveAttributeValue: (attribute, expected, element) => element.getAttribute(expected) === element
});

declare global {
	namespace jasmine {
		interface Matchers<T> {
			toHaveAttributeValue(attribute: string, value: string): boolean;
		}
	}
}
