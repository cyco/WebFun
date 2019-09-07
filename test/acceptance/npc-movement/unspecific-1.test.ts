import { describeNPCMovement } from "test/helpers";
import { Char } from "src/engine/objects";
import { rand, Point } from "src/util";

describeNPCMovement(Char.MovementType.Unspecific1, (ctx, t, vars) => {
	it("moves as expected", async () => {
		const { npc } = vars;
		ctx.engine.metronome.start();

		let ticks = -1;
		const tick = (i: number) => {
			const p = t(Array.Repeat(".", i - ticks).join(""));
			ticks = i;
			return p;
		};

		await tick(1);
		expect(npc.position).toEqual(new Point(4, 4));
		await tick(4);
		expect(npc.position).toEqual(new Point(4, 5));
		await tick(6);
		expect(npc.position).toEqual(new Point(4, 4));
		await tick(8);
		expect(npc.position).toEqual(new Point(4, 3));
		await tick(10);
		expect(npc.position).toEqual(new Point(4, 2));
		await tick(12);
		expect(npc.position).toEqual(new Point(4, 1));
		await tick(14);
		expect(npc.position).toEqual(new Point(4, 2));
		await tick(15);
		expect(npc.position).toEqual(new Point(4, 3));
		await tick(16);
		expect(npc.position).toEqual(new Point(4, 4));
		await tick(17);
		expect(npc.position).toEqual(new Point(4, 5));
		await tick(19);
		expect(npc.position).toEqual(new Point(3, 6));
		await tick(59);
		expect(npc.position).toEqual(new Point(4, 5));
		await tick(62);
		expect(npc.position).toEqual(new Point(5, 5));
		await tick(63);
		expect(npc.position).toEqual(new Point(6, 4));
		await tick(69);
		expect(npc.position).toEqual(new Point(7, 3));
		await tick(70);
		expect(npc.position).toEqual(new Point(7, 2));
		await tick(71);
		expect(npc.position).toEqual(new Point(6, 3));
		await tick(72);
		expect(npc.position).toEqual(new Point(5, 4));
		await tick(97);
		expect(npc.position).toEqual(new Point(4, 4));
		await tick(98);
		expect(npc.position).toEqual(new Point(4, 5));
		await tick(103);
		expect(npc.position).toEqual(new Point(4, 4));
		await tick(104);
		expect(npc.position).toEqual(new Point(3, 5));
		await tick(107);
		expect(npc.position).toEqual(new Point(2, 4));
		await tick(120);
		expect(npc.position).toEqual(new Point(7, 2));
		await tick(156);
		expect(npc.position).toEqual(new Point(4, 2));
		await tick(157);
		expect(npc.position).toEqual(new Point(4, 3));
		await tick(160);
		expect(npc.position).toEqual(new Point(4, 4));
		await tick(161);
		expect(npc.position).toEqual(new Point(4, 5));
		await tick(167);
		expect(npc.position).toEqual(new Point(4, 4));
		await tick(169);
		expect(npc.position).toEqual(new Point(4, 5));
		await tick(170);
		expect(npc.position).toEqual(new Point(4, 4));
		await tick(183);
		expect(npc.position).toEqual(new Point(1, 2));
		await tick(185);
		expect(npc.position).toEqual(new Point(2, 3));
		await tick(187);
		expect(npc.position).toEqual(new Point(3, 4));
		await tick(189);
		expect(npc.position).toEqual(new Point(4, 5));

		expect(rand()).toBe(32275);
	});
});
