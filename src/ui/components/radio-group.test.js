import RadioGroup from './radio-group';

describe('RadioGroup', () => {
	it('provides a method for grouping radio buttons', () => {
		let button = {};
		
		let group = new RadioGroup();
		group.addButton(button);
		expect(group.buttons.length).toBe(1);
		expect(group.buttons[0]).toBe(button);
		expect(button.groupID).not.toBe(undefined);
	});
	
	it('buttons can also be passed in to the constructor', () => {
		let button = {};
		
		let group = new RadioGroup([button]);
		expect(group.buttons.length).toBe(1);
		expect(group.buttons[0]).toBe(button);
		expect(button.groupID).not.toBe(undefined);
	});
});
