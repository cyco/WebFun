import addMatchers from "add-matchers";

const toDefineTag = (received, actual) => {
	return received.TagName === actual;
};

addMatchers({
	toDefineTag: toDefineTag
});
