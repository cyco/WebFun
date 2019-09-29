import { describeMonsterMovement } from "test/helpers";
import { Char } from "src/engine/objects";
import { rand, Point } from "src/util";

describeMonsterMovement(Char.MovementType.Unspecific4, (ctx, t, vars) => {
	it("moves as expected", async () => {
		const { monster } = vars;
		ctx.engine.metronome.start();

		let ticks = -1;
		const tick = (i: number) => {
			const p = t(Array.Repeat(".", i - ticks).join(""));
			ticks = i;
			return p;
		};

		await tick(2), expect(monster.position).toEqual(new Point(5, 2));
		await tick(5), expect(monster.position).toEqual(new Point(4, 2));
		await tick(8), expect(monster.position).toEqual(new Point(5, 2));
		await tick(11), expect(monster.position).toEqual(new Point(6, 3));
		await tick(14), expect(monster.position).toEqual(new Point(7, 3));
		await tick(17), expect(monster.position).toEqual(new Point(6, 3));
		await tick(20), expect(monster.position).toEqual(new Point(5, 4));
		await tick(23), expect(monster.position).toEqual(new Point(6, 5));
		await tick(26), expect(monster.position).toEqual(new Point(7, 6));
		await tick(29), expect(monster.position).toEqual(new Point(7, 5));
		await tick(32), expect(monster.position).toEqual(new Point(6, 4));
		await tick(35), expect(monster.position).toEqual(new Point(7, 5));
		await tick(38), expect(monster.position).toEqual(new Point(7, 4));
		await tick(41), expect(monster.position).toEqual(new Point(7, 5));
		await tick(44), expect(monster.position).toEqual(new Point(7, 6));
		await tick(47), expect(monster.position).toEqual(new Point(7, 5));
		await tick(53), expect(monster.position).toEqual(new Point(7, 4));
		await tick(56), expect(monster.position).toEqual(new Point(7, 5));
		await tick(59), expect(monster.position).toEqual(new Point(7, 6));
		await tick(62), expect(monster.position).toEqual(new Point(7, 7));
		await tick(65), expect(monster.position).toEqual(new Point(7, 6));
		await tick(68), expect(monster.position).toEqual(new Point(7, 7));
		await tick(71), expect(monster.position).toEqual(new Point(6, 7));
		await tick(74), expect(monster.position).toEqual(new Point(6, 6));
		await tick(77), expect(monster.position).toEqual(new Point(5, 7));
		await tick(80), expect(monster.position).toEqual(new Point(5, 6));
		await tick(83), expect(monster.position).toEqual(new Point(4, 5));
		await tick(86), expect(monster.position).toEqual(new Point(3, 5));
		await tick(89), expect(monster.position).toEqual(new Point(3, 4));
		await tick(92), expect(monster.position).toEqual(new Point(3, 3));
		await tick(95), expect(monster.position).toEqual(new Point(3, 4));
		await tick(98), expect(monster.position).toEqual(new Point(2, 4));
		await tick(101), expect(monster.position).toEqual(new Point(1, 4));
		await tick(104), expect(monster.position).toEqual(new Point(1, 5));
		await tick(107), expect(monster.position).toEqual(new Point(1, 6));
		await tick(110), expect(monster.position).toEqual(new Point(1, 5));
		await tick(113), expect(monster.position).toEqual(new Point(1, 4));
		await tick(116), expect(monster.position).toEqual(new Point(2, 3));
		await tick(119), expect(monster.position).toEqual(new Point(2, 4));
		await tick(122), expect(monster.position).toEqual(new Point(3, 5));
		await tick(125), expect(monster.position).toEqual(new Point(4, 5));
		await tick(128), expect(monster.position).toEqual(new Point(5, 6));
		await tick(131), expect(monster.position).toEqual(new Point(6, 6));
		await tick(134), expect(monster.position).toEqual(new Point(6, 5));
		await tick(137), expect(monster.position).toEqual(new Point(5, 5));
		await tick(140), expect(monster.position).toEqual(new Point(6, 5));
		await tick(143), expect(monster.position).toEqual(new Point(6, 4));
		await tick(146), expect(monster.position).toEqual(new Point(5, 4));
		await tick(149), expect(monster.position).toEqual(new Point(5, 3));
		await tick(152), expect(monster.position).toEqual(new Point(6, 2));
		await tick(155), expect(monster.position).toEqual(new Point(7, 1));
		await tick(158), expect(monster.position).toEqual(new Point(7, 2));
		await tick(161), expect(monster.position).toEqual(new Point(6, 1));
		await tick(164), expect(monster.position).toEqual(new Point(7, 1));
		await tick(167), expect(monster.position).toEqual(new Point(7, 2));
		await tick(170), expect(monster.position).toEqual(new Point(7, 1));
		await tick(176), expect(monster.position).toEqual(new Point(7, 2));
		await tick(179), expect(monster.position).toEqual(new Point(6, 2));
		await tick(182), expect(monster.position).toEqual(new Point(5, 1));
		await tick(185), expect(monster.position).toEqual(new Point(6, 1));
		await tick(188), expect(monster.position).toEqual(new Point(5, 1));
		await tick(191), expect(monster.position).toEqual(new Point(4, 2));
		await tick(194), expect(monster.position).toEqual(new Point(3, 2));
		await tick(197), expect(monster.position).toEqual(new Point(3, 1));
		await tick(200), expect(monster.position).toEqual(new Point(2, 1));
		await tick(203), expect(monster.position).toEqual(new Point(3, 2));
		await tick(206), expect(monster.position).toEqual(new Point(2, 2));
		await tick(209), expect(monster.position).toEqual(new Point(1, 2));

		expect(rand()).toBe(3163);
	});
});
