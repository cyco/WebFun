import { Character } from "src/engine/objects";
import { Point, rand } from "src/util";

describeMonsterMovement(Character.MovementType.Patrol, (ctx, tick, vars) => {
	it("moves as expected", async () => {
		const { monster } = vars;
		monster.waypoints = [new Point(1, 1), new Point(7, 1), new Point(7, 7), new Point(1, 7)];

		await tick(".");
		expect(monster.position).toEqual(new Point(5, 2));
		await tick("..............");
		expect(monster.position).toEqual(new Point(7, 5));
		await tick("........................");
		expect(monster.position).toEqual(new Point(1, 5));
		await tick("..............");
		expect(monster.position).toEqual(new Point(3, 1));
		await tick("...");
		expect(monster.position).toEqual(new Point(4, 1));

		expect(rand()).toBe(22352);
	});
});
