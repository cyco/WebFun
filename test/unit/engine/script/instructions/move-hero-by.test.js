import { Instruction } from "src/engine/objects";
import { Point } from "src/util";
import MoveHeroBy from "src/engine/script/instructions/move-hero-by";

describeInstruction("MoveHeroBy", (execute, engine) => {
	it("updates the hero's position", async done => {
		engine.hero.location = new Point(3, 2);

		const instruction = new Instruction({});
		instruction._opcode = MoveHeroBy.Opcode;
		instruction._arguments = [-1, 1];

		await execute(instruction);

		expect(engine.hero.location.x).toBe(2);
		expect(engine.hero.location.y).toBe(3);

		done();
	});
});
