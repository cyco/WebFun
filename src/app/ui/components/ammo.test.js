import { sandboxed } from 'test-helpers/dom-sandbox';
import Ammo from '/app/ui/components/ammo';

xdescribe('Ammo', sandboxed(function(sand) {
	let subject;

	it('shows a simple bar inidcating how much ammo is left', () => {
		subject = new Ammo();
		sand.box.appendChild(subject.element);
		expect(sand.box.querySelector('.ammo-view')).not.toBeNull();
	});

	it('it has an accessor to set the current level of available ammo', () => {
		expect(subject.ammo).toBe(0);

		subject.ammo = 1;
		expect(subject.ammo).toBe(1);
	});

	it('roughly reflects the current ammo in a bar whose height changes', () => {
		let indicator = subject.element.querySelector('.value');
		subject.ammo = 1;
		expect(parseInt(indicator.style.height)).toBeGreaterThan(90);

		subject.ammo = 0;
		expect(parseInt(indicator.style.height)).toBe(0);
	});

	it('a value of 0xFF or -1 indicates that there is no current weapon', () => {
		let background = subject.element.querySelector('.background');

		subject.ammo = 0xFF;
		expect(background.style.backgroundColor).toBe('');

		subject.ammo = 0;
		expect(background.style.backgroundColor).not.toBe('');

		subject.ammo = -1;
		expect(background.style.backgroundColor).toBe('');
	});
}));
