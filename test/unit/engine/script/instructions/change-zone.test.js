import { Instruction } from "src/engine/objects";
import ChangeZone from "src/engine/script/instructions/change-zone";

describeInstruction("ChangeZone", (execute, engine) => {
	it("Switches to a differnt zone using the room animation", async (done) => {
		const zone = {};
		engine.data.zones = [null, null, zone, null];
		engine.dagobah = {locationOfZone: () => true};
		engine.sceneManager = {
			pushScene() {
			}
		};
		spyOn(engine.sceneManager, "pushScene");

		let instruction = new Instruction({});
		instruction._opcode = ChangeZone.Opcode;
		instruction._arguments = [2];

		await execute(instruction);

		expect(engine.sceneManager.pushScene).toHaveBeenCalled();

		engine.dagobah = {locationOfZone: () => false};
		engine.world = {locationOfZone: () => true};

		await execute(instruction);
		expect(engine.sceneManager.pushScene).toHaveBeenCalledTimes(2);

		engine.dagobah = {locationOfZone: () => false};
		engine.world = {locationOfZone: () => false};

		await execute(instruction);
		expect(engine.sceneManager.pushScene).toHaveBeenCalledTimes(3);

		done();
	});
});
