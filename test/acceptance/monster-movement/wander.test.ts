import { describeMonsterMovement } from "test/helpers";
import { Character } from "src/engine/objects";
import { rand, Point } from "src/util";

describeMonsterMovement(Character.MovementType.Wander, (ctx, tick, vars) => {
	it("moves as expected", async () => {
		const { monster } = vars;

		await tick(".");
		expect(monster.position).toEqual(new Point(5, 3));

		await tick(Array.Repeat(".", 4).join(""));
		expect(monster.position).toEqual(new Point(7, 3));

		await tick(Array.Repeat(".", 12).join(""));
		expect(monster.position).toEqual(new Point(7, 7));

		await tick(Array.Repeat(".", 14).join(""));
		expect(monster.position).toEqual(new Point(7, 1));

		await tick(Array.Repeat(".", 32).join(""));
		expect(monster.position).toEqual(new Point(7, 1));

		await tick(Array.Repeat(".", 16).join(""));
		expect(monster.position).toEqual(new Point(1, 1));

		await tick(Array.Repeat(".", 32).join(""));
		expect(monster.position).toEqual(new Point(7, 7));

		await tick(Array.Repeat(".", 18).join(""));
		expect(monster.position).toEqual(new Point(1, 7));

		await tick(Array.Repeat(".", 20).join(""));
		expect(monster.position).toEqual(new Point(1, 1));

		await tick(Array.Repeat(".", 16).join(""));
		expect(monster.position).toEqual(new Point(7, 1));

		await tick("↑↑↑↑↑");
		await tick(Array.Repeat(".", 4).join(""));
		expect(monster.position).toEqual(new Point(5, 1));

		expect(rand()).toBe(22336);
	});
});
