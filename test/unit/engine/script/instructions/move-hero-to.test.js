import { Instruction } from "src/engine/objects";
import MoveHeroTo from "src/engine/script/instructions/move-hero-to";
import { ZoneScene } from "src/engine/scenes";
import { Point } from "src/util";

describeInstruction("MoveHeroTo", (execute, engine) => {
	it("sets the hero's position", async done => {
		engine.hero.location = new Point(3, 2);

		let instruction = new Instruction({});
		instruction._opcode = MoveHeroTo.Opcode;
		instruction._arguments = [7, 4];

		await execute(instruction);
		expect(engine.hero.location.x).toBe(7);
		expect(engine.hero.location.y).toBe(4);

		done();
	});

	it("executes hotspots if the hero is hidden", async done => {
		engine.sceneManager = { currentScene: new ZoneScene() };
		spyOn(engine.sceneManager.currentScene, "executeHotspots");
		engine.hero.visible = false;

		let instruction = new Instruction({});
		instruction._opcode = MoveHeroTo.Opcode;
		instruction._arguments = [2, 1];

		await execute(instruction);

		expect(engine.sceneManager.currentScene.executeHotspots).toHaveBeenCalled();

		done();
	});
});
