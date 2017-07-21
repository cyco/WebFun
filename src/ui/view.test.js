import sandboxed from "test-helpers/dom-sandbox";
import View from "/ui/view";

describe('View', sandboxed(function (sand) {
	it('managed a dom node that can be displayed', () => {
		let view = new View();
		sand.box.appendChild(view.element);
	});
}));
