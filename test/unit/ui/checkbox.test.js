import sandboxed from '../../helpers/dom-sandbox';
import simulateEvent from '../../helpers/dom-events';

import Checkbox from '/ui/checkbox';
describe('Checkbox', sandboxed(function(sand){
	let checkbox;
	it('displays a checkbox', () => {
		checkbox = new Checkbox();
		sand.box.appendChild(checkbox.element);
	});
	
	it('can have a title', () => {
		let labelNode = checkbox.element.querySelector('label');
		checkbox.title = "test title";
		expect(checkbox.title).toBe('test title');
		expect(labelNode.textContent.indexOf('test title')).not.toBe(-1);
	});
	
	it('can be checked', () => {
		expect(checkbox.checked).toBe(false);
		
		checkbox.checked = true;
		expect(checkbox.checked).toBe(true);
		let inputNode = checkbox.element.querySelector('input[type=checkbox]');		
		expect(inputNode.checked).toBe(true);
	
		checkbox.checked = false;
		expect(checkbox.checked).toBe(false);
		expect(inputNode.checked).toBe(false);
	});
	
	it('when changed it calls it\s onclick callback', (done) => {
		let callback = () => {
			expect(true).toBe(true);
			done();
		};
		checkbox.onchange = callback;
		expect(checkbox.onchange).toBe(callback);
		
		let inputNode = checkbox.element.querySelector('input[type=checkbox]');		
		simulateEvent(inputNode, 'change');
	});
}));