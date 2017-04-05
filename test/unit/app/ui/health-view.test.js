import sandboxed from '../../../helpers/dom-sandbox';
import HealthView from '/app/ui/health-view';

describe('HealthView', sandboxed(function(sand) {
	it('displays the hero\'s health in a circle', () => {
		let healthView = new HealthView();
		sand.box.appendChild(healthView.element);
	});
}));
