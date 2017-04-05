import sandboxed from '../../helpers/dom-sandbox';
import Textbox from '/ui/textbox';

describe('Textbox', sandboxed(function(sand) {
	it('displays a box where text can be entered', () => {
		let textbox = new Textbox();
		sand.box.appendChild(textbox.element);
	});
}));
