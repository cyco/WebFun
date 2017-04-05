import sandboxed from '../../../helpers/dom-sandbox';
import WeaponView from '/app/ui/weapon-view';

describe('WeaponView', sandboxed(function(sand) {
	it('shows which weapon is currently equipped', () => {
		let view = new WeaponView();
		sand.box.appendChild(view.element);
	});
}));
