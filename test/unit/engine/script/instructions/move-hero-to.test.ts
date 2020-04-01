import MoveHeroTo from "src/engine/script/instructions/move-hero-to";
import { Point } from "src/util";

describeInstruction("MoveHeroTo", (execute, engine) => {
	it("sets the hero's position", async () => {
		engine.hero.location = new Point(3, 2);

		const instruction: any = {};
		instruction.opcode = MoveHeroTo.Opcode;
		instruction.arguments = [7, 4];

		await execute(instruction);
		expect(engine.hero.location.x).toBe(7);
		expect(engine.hero.location.y).toBe(4);
	});
});
