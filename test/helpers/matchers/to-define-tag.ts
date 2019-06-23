import addMatchers from "add-matchers";

const toDefineTag = (received: any, actual: string) => {
	return received.tagName === actual;
};

addMatchers({
	toDefineTag: toDefineTag
});

declare global {
	namespace jasmine {
		interface Matchers<T> {
			toDefineTag(tag: string): boolean;
		}
	}
}
