import { describeNPCMovement } from "test/helpers";
import { CharMovementType } from "src/engine/objects";
import { Point, dispatch } from "src/util";

describeNPCMovement(CharMovementType.Patrol, (ctx, tick, vars) => {
	it("moves as expected", async () => {
		const { npc } = vars;
		return;
		ctx.engine.metronome.start();

		await tick(".");
		expect(npc.position).toEqual(new Point(3, 2));

		console.log("--");
		const orignalLog = console.log;
		const start = ctx.engine.metronome.tickCount;
		console.log = (...args) => orignalLog.call(console, ctx.engine.metronome.tickCount - start, ...args);

		await dispatch(() => void 0, 50000);
		// expect(rand()).toBe(22352);
	});
});
