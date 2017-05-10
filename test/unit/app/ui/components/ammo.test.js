import sandboxed from '../../../helpers/dom-sandbox';
import AmmoView from '/app/ui/ammo-view';

describe('AmmoView', sandboxed(function(sand) {
	let ammoView;

	it('shows a simple bar inidcating how much ammo is left', () => {
		ammoView = new AmmoView();
		sand.box.appendChild(ammoView.element);
		expect(sand.box.querySelector('.ammo-view')).not.toBeNull();
	});

	it('it has an accessor to set the current level of available ammo', () => {
		expect(ammoView.ammo).toBe(0);

		ammoView.ammo = 1;
		expect(ammoView.ammo).toBe(1);
	});

	it('roughly reflects the current ammo in a bar whose height changes', () => {
		let indicator = ammoView.element.querySelector('.value');
		ammoView.ammo = 1;
		expect(parseInt(indicator.style.height)).toBeGreaterThan(90);

		ammoView.ammo = 0;
		expect(parseInt(indicator.style.height)).toBe(0);
	});

	it('a value of 0xFF or -1 indicates that there is no current weapon', () => {
		let background = ammoView.element.querySelector('.background');

		ammoView.ammo = 0xFF;
		expect(background.style.backgroundColor).toBe('');

		ammoView.ammo = 0;
		expect(background.style.backgroundColor).not.toBe('');

		ammoView.ammo = -1;
		expect(background.style.backgroundColor).toBe('');
	});
}));
