import { sandboxed } from '../../../../helpers/dom-sandbox';
import Health from '/app/ui/components/health';

xdescribe('Health', sandboxed(function(sand) {
	it('displays the hero\'s health in a circle', () => {
		let healthView = new Health();
		sand.box.appendChild(healthView.element);
		
		expect(healthView.element.querySelector('svg')).not.toBe(null);
	});
	
	it('starts off with full health', () => {
		let healthView = new Health();
		sand.box.appendChild(healthView.element);
		
		expect(healthView.health).toBe(300);
		expect(healthView.lives).toBe(3);
		expect(healthView.damage).toBe(0);
	});
}));
