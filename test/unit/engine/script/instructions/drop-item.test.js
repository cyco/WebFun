import { Instruction } from "src/engine/objects";
import DropItem from "src/engine/script/instructions/drop-item";

describeInstruction("DropItem", (execute, engine) => {
	it("shows the pick-up scene with the specified item at the correct location", async done => {
		spyOn(engine.sceneManager, "pushScene");
		const mockTile = {};
		engine.data = { tiles: [null, null, null, mockTile] };

		let instruction = new Instruction({});
		instruction._opcode = DropItem.Opcode;
		instruction._arguments = [3, 1, 2];

		await execute(instruction);

		expect(engine.sceneManager.pushScene).toHaveBeenCalled();
		const scene = engine.sceneManager.pushScene.calls.mostRecent().args[0];
		expect(scene.tile).toBe(mockTile);
		expect(scene.location.x).toBe(1);
		expect(scene.location.y).toBe(2);

		done();
	});
});
