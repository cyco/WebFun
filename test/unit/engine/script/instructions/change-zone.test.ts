import { Zone } from "src/engine/objects";
import ChangeZone from "src/engine/script/instructions/change-zone";
import { RoomTransitionScene } from "src/engine/scenes";

describeInstruction("ChangeZone", (execute, engine) => {
	let mockZone: Zone;
	beforeEach(() => {
		mockZone = {} as any;
		engine.assets.populate(Zone, [null, null, mockZone, null]);
		engine.sceneManager = {
			pushScene: jasmine.createSpy(),
			popScene: jasmine.createSpy()
		};
		spyOn(engine, "findLocationOfZone").and.returnValue({});
	});

	it("Switches to a different zone using the room animation", async () => {
		const instruction = { opcode: ChangeZone.Opcode, arguments: [2] };

		await execute(instruction);

		expect(engine.sceneManager.pushScene).toHaveBeenCalledWith(jasmine.any(RoomTransitionScene));
	});

	it("ensures that no two transition scenes overlap", async () => {
		engine.sceneManager.currentScene = new RoomTransitionScene();

		const instruction = { opcode: ChangeZone.Opcode, arguments: [2] };

		await execute(instruction);

		expect(engine.sceneManager.popScene).toHaveBeenCalledTimes(1);
	});
});
