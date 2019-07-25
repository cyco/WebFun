import { describeNPCMovement } from "test/helpers";
import { CharMovementType } from "src/engine/objects";
import { rand, Point } from "src/util";

describeNPCMovement(CharMovementType.Droid, (ctx, tick, vars) => {
	it("moves as expected", async () => {
		const { npc } = vars;
		ctx.engine.metronome.start();

		await tick(".");
		expect(npc.position).toEqual(new Point(5, 3));
		await tick(Array.Repeat(".", 9).join(""));
		expect(npc.position).toEqual(new Point(5, 3));
		await tick(Array.Repeat(".", 5).join(""));
		expect(npc.position).toEqual(new Point(2, 4));
		await tick(Array.Repeat(".", 30).join(""));
		expect(npc.position).toEqual(new Point(7, 6));
		await tick(Array.Repeat(".", 56).join(""));
		expect(npc.position).toEqual(new Point(5, 4));
		await tick(Array.Repeat(".", 120).join(""));
		expect(npc.position).toEqual(new Point(1, 2));

		expect(rand()).toBe(31483);
	});
});