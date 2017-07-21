import addMatchers from "add-matchers";

const toDefineTag = (received, actual) => {
	console.log('toDefineTag', received.TagName, actual, received);
	return received.TagName === actual;
};

addMatchers({
	toDefineTag: toDefineTag
});
