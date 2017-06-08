import { Instruction } from '/engine/objects';
import * as AddItem from './add-item';

describeInstruction('AddItem', (execute, engine) => {
	it('adds an item to the inventory', () => {
		engine.data.tiles = [null, 'fake-tile'];
		engine.inventory = { addItem() {} };

		spyOn(engine.inventory, 'addItem');

		let instruction = new Instruction({});
		instruction._opcode = AddItem.Opcode;
		instruction._arguments = [1];

		execute(instruction);
		expect(engine.inventory.addItem).toHaveBeenCalledWith('fake-tile');
	});
});

