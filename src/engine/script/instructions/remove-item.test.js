import { Instruction } from "/engine/objects";
import * as RemoveItem from "./remove-item";

describeInstruction('RemoveItem', (execute, engine) => {
	it('removes an item from the inventory', () => {
		engine.data.tiles = [null, 'fake-tile'];
		engine.inventory = {
			removeItem() {
			}
		};

		spyOn(engine.inventory, 'removeItem');

		let instruction = new Instruction({});
		instruction._opcode = RemoveItem.Opcode;
		instruction._arguments = [1];

		execute(instruction);
		expect(engine.inventory.removeItem).toHaveBeenCalledWith('fake-tile');
	});
});

