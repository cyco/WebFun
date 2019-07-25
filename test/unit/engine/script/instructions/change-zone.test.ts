import { Zone, Instruction } from "src/engine/objects";
import ChangeZone from "src/engine/script/instructions/change-zone";

describeInstruction("ChangeZone", (execute, engine) => {
	it("Switches to a differnt zone using the room animation", async () => {
		const zone = {};
		engine.assetManager.populate(Zone, [null, null, zone, null]);
		engine.dagobah = { locationOfZone: () => true };
		engine.sceneManager = {
			pushScene() {}
		};
		spyOn(engine.sceneManager, "pushScene");

		const instruction = new Instruction({ opcode: ChangeZone.Opcode, arguments: [2] });

		await execute(instruction);

		expect(engine.sceneManager.pushScene).toHaveBeenCalled();

		engine.dagobah = { locationOfZone: () => false };
		engine.world = { locationOfZone: () => true };

		await execute(instruction);
		expect(engine.sceneManager.pushScene).toHaveBeenCalledTimes(2);

		engine.dagobah = { locationOfZone: () => false };
		engine.world = { locationOfZone: () => false };

		await execute(instruction);
		expect(engine.sceneManager.pushScene).toHaveBeenCalledTimes(3);
	});
});
