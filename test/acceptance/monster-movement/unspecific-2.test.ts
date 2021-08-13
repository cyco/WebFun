import { describeMonsterMovement } from "test/helpers";
import { Character } from "src/engine/objects";
import { rand, Point } from "src/util";

describeMonsterMovement(Character.MovementType.Unspecific2, (ctx, t, vars) => {
	it("moves as expected", async () => {
		const { monster } = vars;

		let ticks = -1;
		const tick = (i: number) => {
			const p = t(Array.Repeat(".", i - ticks).join(""));
			ticks = i;
			return p;
		};

		await tick(1), expect(monster.position).toEqual(new Point(5, 3));
		await tick(4), expect(monster.position).toEqual(new Point(6, 3));
		await tick(5), expect(monster.position).toEqual(new Point(7, 3));
		await tick(11), expect(monster.position).toEqual(new Point(7, 2));
		await tick(14), expect(monster.position).toEqual(new Point(7, 1));
		await tick(18), expect(monster.position).toEqual(new Point(6, 1));
		await tick(19), expect(monster.position).toEqual(new Point(5, 1));
		await tick(20), expect(monster.position).toEqual(new Point(4, 1));
		await tick(21), expect(monster.position).toEqual(new Point(3, 1));
		await tick(26), expect(monster.position).toEqual(new Point(2, 1));
		await tick(29), expect(monster.position).toEqual(new Point(1, 1));
		await tick(41), expect(monster.position).toEqual(new Point(2, 1));
		await tick(42), expect(monster.position).toEqual(new Point(3, 1));
		await tick(44), expect(monster.position).toEqual(new Point(4, 1));
		await tick(45), expect(monster.position).toEqual(new Point(5, 1));
		await tick(48), expect(monster.position).toEqual(new Point(6, 1));
		await tick(50), expect(monster.position).toEqual(new Point(7, 1));
		await tick(77), expect(monster.position).toEqual(new Point(7, 2));
		await tick(84), expect(monster.position).toEqual(new Point(7, 3));
		await tick(86), expect(monster.position).toEqual(new Point(7, 4));
		await tick(88), expect(monster.position).toEqual(new Point(7, 5));
		await tick(89), expect(monster.position).toEqual(new Point(7, 6));
		await tick(91), expect(monster.position).toEqual(new Point(7, 7));
		await tick(97), expect(monster.position).toEqual(new Point(6, 7));
		await tick(98), expect(monster.position).toEqual(new Point(5, 7));
		await tick(104), expect(monster.position).toEqual(new Point(4, 7));
		await tick(114), expect(monster.position).toEqual(new Point(3, 6));
		await tick(117), expect(monster.position).toEqual(new Point(4, 5));
		await tick(123), expect(monster.position).toEqual(new Point(5, 4));
		await tick(128), expect(monster.position).toEqual(new Point(6, 4));
		await tick(129), expect(monster.position).toEqual(new Point(7, 4));
		await tick(133), expect(monster.position).toEqual(new Point(7, 5));
		await tick(134), expect(monster.position).toEqual(new Point(7, 6));
		await tick(137), expect(monster.position).toEqual(new Point(7, 7));
		await tick(148), expect(monster.position).toEqual(new Point(6, 7));
		await tick(150), expect(monster.position).toEqual(new Point(5, 7));
		await tick(151), expect(monster.position).toEqual(new Point(6, 7));
		await tick(154), expect(monster.position).toEqual(new Point(5, 7));
		await tick(175), expect(monster.position).toEqual(new Point(6, 7));
		await tick(178), expect(monster.position).toEqual(new Point(5, 7));
		await tick(192), expect(monster.position).toEqual(new Point(6, 7));

		expect(rand()).toBe(15248);
	});
});
