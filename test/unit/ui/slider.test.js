import sandboxed from '../../helpers/dom-sandbox';
import Slider from '/ui/slider';

describe('Slider', sandboxed(function(sand){
	it('displays a bar that can be used to specify a value from a predefined range', () => {
		let slider = new Slider();
		sand.box.appendChild(slider.element);
	});
}));