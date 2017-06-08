import addMatchers from 'add-matchers';

addMatchers({
	toHaveAttribute: (received, actual) => actual.hasAttribute(received)
});
