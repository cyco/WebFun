import { Instruction } from "/engine/objects";
import * as ChangeZone from "./change-zone";

describeInstruction("ChangeZone", (execute, engine) => {
	it("Switches to a differnt zone using the room animation", () => {
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

		execute(instruction);

		expect(engine.sceneManager.pushScene).toHaveBeenCalled();

		engine.dagobah = {locationOfZone: () => false};
		engine.world = {locationOfZone: () => true};

		execute(instruction);
		expect(engine.sceneManager.pushScene).toHaveBeenCalledTimes(2);

		engine.dagobah = {locationOfZone: () => false};
		engine.world = {locationOfZone: () => false};

		execute(instruction);
		expect(engine.sceneManager.pushScene).toHaveBeenCalledTimes(3);
	});
});
