import { Point } from "src/util";
import MoveHeroBy from "src/engine/script/instructions/move-hero-by";

describeInstruction("MoveHeroBy", (execute, engine) => {
	it("updates the hero's position", async () => {
		engine.hero.location = new Point(3, 2);

		const instruction: any = {};
		instruction.opcode = MoveHeroBy.Opcode;
		instruction.arguments = [-1, 2, -1, -1];

		await execute(instruction);

		expect(engine.hero.location.x).toBe(2);
		expect(engine.hero.location.y).toBe(4);
	});

	it("can set the hero's position to an absolute value", async () => {
		engine.hero.location = new Point(3, 2);

		const instruction: any = {};
		instruction.opcode = MoveHeroBy.Opcode;
		instruction.arguments = [-1, -1, 4, 7];

		await execute(instruction);

		expect(engine.hero.location.x).toBe(4);
		expect(engine.hero.location.y).toBe(7);
	});
});
