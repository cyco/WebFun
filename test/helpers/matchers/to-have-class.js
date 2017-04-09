import addMatchers from 'add-matchers';

addMatchers({
	toHaveClass: (received, actual) => actual.classList.contains(received)
});
