import { NodeList } from "std.dom";
import sandboxed from "test-helpers/dom-sandbox";
import forEach from "./for-each";

describe('NodeList.forEach', sandboxed((sand) => {
	it('extends the NodeList prototype', () => {
		expect(typeof forEach).toBe('function');
		expect(typeof NodeList.prototype.forEach).toBe('function');
	});

	it('works just like forEach on an Array', () => {
		let e1 = document.createElement('div');
		e1.className = 'selectMe';
		sand.box.appendChild(e1);
		let e2 = document.createElement('div');
		e2.className = 'selectMe';
		sand.box.appendChild(e2);

		let nodeList = sand.box.querySelectorAll('.selectMe');
		expect(nodeList.forEach).toBeFunction();
		expect(nodeList.length).toBe(2);

		let callCount = 0;
		forEach.call(nodeList, () => {
			callCount++;
		});
		expect(callCount).toBe(nodeList.length);
	});
}));
