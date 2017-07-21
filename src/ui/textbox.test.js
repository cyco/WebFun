import sandboxed from "test-helpers/dom-sandbox";
import Textbox from "/ui/textbox";

describe('Textbox', sandboxed(function (sand) {
	let subject, node;
	beforeEach(() => {
		subject = new Textbox();
		sand.box.appendChild(subject.element);
	});

	it('can be editable', () => {
		expect(subject.editable).toBeTrue();

		subject.editable = false;
		expect(subject.editable).toBeFalse();
		expect(subject.element.hasAttribute('readonly')).toBeTrue();

		subject.editable = true;
		expect(subject.editable).toBeTrue();
		expect(subject.element.hasAttribute('readonly')).toBeFalse();
	});

	it('can have a fixed size', () => {
		subject.width = 250;
		subject.height = 30;

		expect(subject.width).toBe(250);
		expect(subject.height).toBe(30);
	});

	it('might have a value', () => {
		subject.value = 'test string value';
		expect(subject.value).toEqual('test string value');
	});

	it('always returns a string value', () => {
		subject.value = 5;
		expect(subject.value).toBe('5');
	});

	it('has an alignment attribute', () => {
		expect(subject.align).toEqual('left');

		subject.align = 'right';
		expect(subject.align).toEqual('right');
		expect(subject.element.style.textAlign).toEqual('right');
	});

	it('can have an onchange event', () => {
		let handlerCalled = false;
		const handler = () => handlerCalled = true;

		subject.onchange = handler;
		expect(subject.onchange).toBe(handler);

		subject.element.onchange();
		expect(handlerCalled).toBeTrue();
	});
}));
