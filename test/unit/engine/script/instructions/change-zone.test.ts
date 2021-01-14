import { Zone } from "src/engine/objects";
import ChangeZone from "src/engine/script/instructions/change-zone";
import { RoomTransitionScene } from "src/engine/scenes";

describeInstruction("ChangeZone", (execute, engine) => {
	it("Switches to a different zone using the room animation", async () => {
		const zone = {};
		engine.assets.populate(Zone, [null, null, zone, null]);
		engine.sceneManager = {
			pushScene: jasmine.createSpy("pushScene")
		};
		spyOn(engine, "findLocationOfZone").and.returnValue({});

		const instruction = { opcode: ChangeZone.Opcode, arguments: [2] };

		await execute(instruction);

		expect(engine.sceneManager.pushScene).toHaveBeenCalledWith(jasmine.any(RoomTransitionScene));
	});
});
