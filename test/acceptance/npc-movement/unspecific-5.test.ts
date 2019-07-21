import { describeNPCMovement } from "test/helpers";
import { CharMovementType } from "src/engine/objects";
import { rand, Point } from "src/util";

describeNPCMovement(CharMovementType.Unspecific5, (ctx, t, vars) => {
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
		await tick(18), expect(npc.position).toEqual(new Point(7, 2));
		await tick(21), expect(npc.position).toEqual(new Point(7, 1));
		await tick(32), expect(npc.position).toEqual(new Point(6, 1));
		await tick(33), expect(npc.position).toEqual(new Point(5, 1));
		await tick(34), expect(npc.position).toEqual(new Point(4, 1));
		await tick(35), expect(npc.position).toEqual(new Point(3, 1));
		await tick(40), expect(npc.position).toEqual(new Point(2, 1));
		await tick(43), expect(npc.position).toEqual(new Point(1, 1));
		await tick(57), expect(npc.position).toEqual(new Point(2, 1));
		await tick(58), expect(npc.position).toEqual(new Point(3, 1));
		await tick(60), expect(npc.position).toEqual(new Point(4, 1));
		await tick(61), expect(npc.position).toEqual(new Point(5, 1));
		await tick(64), expect(npc.position).toEqual(new Point(6, 1));
		await tick(66), expect(npc.position).toEqual(new Point(7, 1));
		await tick(100), expect(npc.position).toEqual(new Point(7, 2));
		await tick(107), expect(npc.position).toEqual(new Point(7, 3));
		await tick(109), expect(npc.position).toEqual(new Point(7, 4));
		await tick(111), expect(npc.position).toEqual(new Point(7, 5));
		await tick(112), expect(npc.position).toEqual(new Point(7, 6));
		await tick(114), expect(npc.position).toEqual(new Point(7, 7));
		await tick(124), expect(npc.position).toEqual(new Point(6, 7));
		await tick(125), expect(npc.position).toEqual(new Point(5, 7));

		expect(rand()).toBe(6082);
	});
});
