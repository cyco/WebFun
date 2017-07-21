import append from "/extension/element/append";

describe('Element.append', () => {
	it('is a function', () => {
		expect(typeof append).toBe('function');
	});

	it('is a polyfill that combines Element.appendChild and document.createTextNode to get the desired effect', () => {
		let container = document.createElement('div');
		document.body.appendChild(container);

		container.append('test');
		expect(container.innerHTML).toEqual('test');

		document.body.removeChild(container);
	});

	it('can be invoke explicitly to achieve better code coverage', () => {
		let container = document.createElement('div');
		document.body.appendChild(container);

		append.call(container, 'test');
		expect(container.innerHTML).toEqual('test');

		document.body.removeChild(container);
	});
});
