import { Char } from "src/engine/objects";
import { rand, Point } from "src/util";

describeNPCMovement(Char.MovementType.Scaredy, (ctx, tick, vars) => {
	it("moves as expected", async () => {
		const { npc, InitialPosition } = vars;
		ctx.engine.metronome.start();

		expect(npc.position).toEqual(InitialPosition);
		await tick(".");
		expect(npc.position).toEqual(new Point(4, 2));
		await tick(".....");
		expect(npc.position).toEqual(new Point(4, 1));
		await tick("↑↑↑↑...");
		expect(npc.position).toEqual(new Point(4, 1));
		await tick("→.");
		expect(npc.position).toEqual(new Point(3, 1));
		await tick(".");
		expect(npc.position).toEqual(new Point(2, 1));
		await tick(".");
		expect(npc.position).toEqual(new Point(1, 1));
		await tick("↙↓↓↓↓......←←............↖↖....↗");
		expect(npc.position).toEqual(new Point(7, 4));
		await tick("↘↙←↑↑.............................→");
		expect(npc.position).toEqual(new Point(7, 4));
		await tick("↗↑↑↗.............................↓..");
		expect(npc.position).toEqual(new Point(4, 7));
		await tick("↘↓↙↓↓→→→→→..............................");
		expect(npc.position).toEqual(new Point(2, 1));
		await tick("↖↖↖↖↖↖");
		expect(npc.position).toEqual(new Point(1, 1));
		await tick(".................");
		expect(npc.position).toEqual(new Point(1, 1));

		expect(rand()).toBe(23516);
	});
});
