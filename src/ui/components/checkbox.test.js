import sandboxed from 'test-helpers/dom-sandbox';
import simulateEvent from 'test-helpers/dom-events';

import Checkbox from './checkbox';
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
		expect(checkbox.checked).toBeFalse();
		
		checkbox.checked = true;
		expect(checkbox.checked).toBeTrue();
		let inputNode = checkbox.element.querySelector('input[type=checkbox]');		
		expect(inputNode.checked).toBeTrue();
	
		checkbox.checked = false;
		expect(checkbox.checked).toBeFalse();
		expect(inputNode.checked).toBeFalse();
	});
	
	it('when changed it calls it\s onclick callback', (done) => {
		let callback = () => {
			expect(true).toBeTrue();
			done();
		};
		checkbox.onchange = callback;
		expect(checkbox.onchange).toBe(callback);
		
		let inputNode = checkbox.element.querySelector('input[type=checkbox]');		
		simulateEvent(inputNode, 'change');
	});
}));