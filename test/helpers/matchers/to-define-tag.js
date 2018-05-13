import addMatchers from "add-matchers";

const toDefineTag = (received, actual) => {
	return received.tagName === actual;
};

addMatchers({
	toDefineTag: toDefineTag
});
