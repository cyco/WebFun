import clear from "/extension/element/clear";

describe('Element.clear', () => {
	it('removes all children of an element', () => {
		let container = document.createElement('div');
		container.appendChild(document.createElement('span'));
		container.appendChild(document.createElement('span'));
		container.appendChild(document.createElement('span'));

		expect(container.childNodes.length).toBe(3);
		container.clear();
		expect(container.childNodes.length).toBe(0);
	});

	it('also works for text nodes', () => {
		let container = document.createElement('div');
		container.appendChild(document.createTextNode("test"));
		container.appendChild(document.createTextNode("test"));
		container.appendChild(document.createTextNode("test"));

		clear.call(container);
		expect(container.textContent).toBe('');
	});
});
