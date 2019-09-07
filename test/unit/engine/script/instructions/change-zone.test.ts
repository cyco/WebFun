import { Zone, Instruction } from "src/engine/objects";
import ChangeZone from "src/engine/script/instructions/change-zone";

describeInstruction("ChangeZone", (execute, engine) => {
	it("Switches to a differnt zone using the room animation", async () => {
		const zone = {};
		engine.assetManager.populate(Zone, [null, null, zone, null]);
		engine.dagobah = { findLocationOfZone: () => true };
		engine.sceneManager = {
			pushScene: jasmine.createSpy("pushScene")
		};

		const instruction = new Instruction({ opcode: ChangeZone.Opcode, arguments: [2] });

		await execute(instruction);

		expect(engine.sceneManager.pushScene).toHaveBeenCalled();

		engine.dagobah = { findLocationOfZone: () => false };
		engine.world = { findLocationOfZone: () => true };

		await execute(instruction);
		expect(engine.sceneManager.pushScene).toHaveBeenCalledTimes(2);

		engine.dagobah = { findLocationOfZone: () => false };
		engine.world = { findLocationOfZone: () => false };

		await execute(instruction);
		expect(engine.sceneManager.pushScene).toHaveBeenCalledTimes(3);
	});
});
