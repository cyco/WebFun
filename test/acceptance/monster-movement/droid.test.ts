import { describeMonsterMovement } from "test/helpers";
import { Char } from "src/engine/objects";
import { rand, Point } from "src/util";

describeMonsterMovement(Char.MovementType.Droid, (ctx, tick, vars) => {
	it("moves as expected", async () => {
		const { monster } = vars;

		await tick(".");
		expect(monster.position).toEqual(new Point(5, 3));
		await tick(Array.Repeat(".", 9).join(""));
		expect(monster.position).toEqual(new Point(5, 3));
		await tick(Array.Repeat(".", 5).join(""));
		expect(monster.position).toEqual(new Point(2, 4));
		await tick(Array.Repeat(".", 30).join(""));
		expect(monster.position).toEqual(new Point(7, 6));
		await tick(Array.Repeat(".", 56).join(""));
		expect(monster.position).toEqual(new Point(5, 4));
		await tick(Array.Repeat(".", 120).join(""));
		expect(monster.position).toEqual(new Point(1, 2));

		expect(rand()).toBe(31483);
	});
});
