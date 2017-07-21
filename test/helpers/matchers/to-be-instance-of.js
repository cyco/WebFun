import addMatchers from "add-matchers";

addMatchers({
	toBeInstanceOf: (received, actual) => actual instanceof received
});
