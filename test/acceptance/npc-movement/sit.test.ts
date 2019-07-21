import { describeNPCMovement } from "test/helpers";
import { CharMovementType } from "src/engine/objects";

describeNPCMovement(CharMovementType.Sit, (ctx, tick, vars) => {
	it("moves as expected", async () => {
		const { npc, InitialPosition } = vars;
		ctx.engine.metronome.start();

		await tick(".");
		expect(npc.position).toEqual(InitialPosition);

		// expect(rand()).toBe(22352);
	});
});
