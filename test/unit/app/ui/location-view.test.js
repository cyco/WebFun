import sandboxed from '../../../helpers/dom-sandbox';
import LocationView from '/app/ui/location-view';

describe('LocationView', sandboxed(function(sand) {
	it('shows which adjacent zones can be accessed', () => {
		let locationView = new LocationView();
		sand.box.appendChild(locationView.element);
	});
}));
