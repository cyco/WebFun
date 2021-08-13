import { describeMonsterMovement } from "test/helpers";
import { Character } from "src/engine/objects";

describeMonsterMovement(Character.MovementType.Sit, (ctx, tick, vars) => {
	it("moves as expected", async () => {
		const { monster, InitialPosition } = vars;

		await tick(".");
		expect(monster.position).toEqual(InitialPosition);

		// expect(rand()).toBe(22352);
	});
});
