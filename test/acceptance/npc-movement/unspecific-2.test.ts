import { describeNPCMovement } from "test/helpers";
import { CharMovementType } from "src/engine/objects";
import { rand, Point } from "src/util";

describeNPCMovement(CharMovementType.Unspecific2, (ctx, t, vars) => {
	it("moves as expected", async () => {
		const { npc } = vars;
		ctx.engine.metronome.start();

		let ticks = -1;
		const tick = (i: number) => {
			const p = t(Array.Repeat(".", i - ticks).join(""));
			ticks = i;
			return p;
		};

		await tick(1), expect(npc.position).toEqual(new Point(5, 3));
		await tick(4), expect(npc.position).toEqual(new Point(6, 3));
		await tick(5), expect(npc.position).toEqual(new Point(7, 3));
		await tick(11), expect(npc.position).toEqual(new Point(7, 2));
		await tick(14), expect(npc.position).toEqual(new Point(7, 1));
		await tick(18), expect(npc.position).toEqual(new Point(6, 1));
		await tick(19), expect(npc.position).toEqual(new Point(5, 1));
		await tick(20), expect(npc.position).toEqual(new Point(4, 1));
		await tick(21), expect(npc.position).toEqual(new Point(3, 1));
		await tick(26), expect(npc.position).toEqual(new Point(2, 1));
		await tick(29), expect(npc.position).toEqual(new Point(1, 1));
		await tick(41), expect(npc.position).toEqual(new Point(2, 1));
		await tick(42), expect(npc.position).toEqual(new Point(3, 1));
		await tick(44), expect(npc.position).toEqual(new Point(4, 1));
		await tick(45), expect(npc.position).toEqual(new Point(5, 1));
		await tick(48), expect(npc.position).toEqual(new Point(6, 1));
		await tick(50), expect(npc.position).toEqual(new Point(7, 1));
		await tick(77), expect(npc.position).toEqual(new Point(7, 2));
		await tick(84), expect(npc.position).toEqual(new Point(7, 3));
		await tick(86), expect(npc.position).toEqual(new Point(7, 4));
		await tick(88), expect(npc.position).toEqual(new Point(7, 5));
		await tick(89), expect(npc.position).toEqual(new Point(7, 6));
		await tick(91), expect(npc.position).toEqual(new Point(7, 7));
		await tick(97), expect(npc.position).toEqual(new Point(6, 7));
		await tick(98), expect(npc.position).toEqual(new Point(5, 7));
		await tick(104), expect(npc.position).toEqual(new Point(4, 7));
		await tick(114), expect(npc.position).toEqual(new Point(3, 6));
		await tick(117), expect(npc.position).toEqual(new Point(4, 5));
		await tick(123), expect(npc.position).toEqual(new Point(5, 4));
		await tick(128), expect(npc.position).toEqual(new Point(6, 4));
		await tick(129), expect(npc.position).toEqual(new Point(7, 4));
		await tick(133), expect(npc.position).toEqual(new Point(7, 5));
		await tick(134), expect(npc.position).toEqual(new Point(7, 6));
		await tick(137), expect(npc.position).toEqual(new Point(7, 7));
		await tick(148), expect(npc.position).toEqual(new Point(6, 7));
		await tick(150), expect(npc.position).toEqual(new Point(5, 7));
		await tick(151), expect(npc.position).toEqual(new Point(6, 7));
		await tick(154), expect(npc.position).toEqual(new Point(5, 7));
		await tick(175), expect(npc.position).toEqual(new Point(6, 7));
		await tick(178), expect(npc.position).toEqual(new Point(5, 7));
		await tick(192), expect(npc.position).toEqual(new Point(6, 7));

		expect(rand()).toBe(15248);
	});
});
