import sandboxed from '../../helpers/dom-sandbox';
import simulateEvent from '../../helpers/dom-events';

import Button from '/ui/button';

describe('Button', sandboxed(function(sand) {
	let subject;
	beforeEach(() => subject = new Button());

	it('displays a button that can be clicked', () => {
		sand.box.appendChild(subject.element);

		expect(subject.element.tagName.toLowerCase()).toBe('button');
	});

	it('can have a title', () => {
		subject.title = "test title";
		expect(subject.title).toBe('test title');
		expect(subject.element.textContent.indexOf('test title')).not.toBe(-1);
	});

	it('can be enabled or disabled', () => {
		expect(subject.enabled).toBe(true);

		subject.enabled = false;
		expect(subject.enabled).toBe(false);

		subject.enabled = true;
		expect(subject.enabled).toBe(true);
	});

	it('when clicked it calls it\'s onclick callback', (done) => {
		let callback = () => {
			expect(true).toBe(true);
			done();
		};
		subject.onclick = callback;
		expect(subject.onclick).toBe(callback);
		simulateEvent(subject.element, 'click');
	});
}));
