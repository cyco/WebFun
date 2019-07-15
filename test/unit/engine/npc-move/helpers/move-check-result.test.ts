import { MoveCheckResult } from "src/engine/npc-move/helpers";

describe("WebFun.Engine.NPCMove.Helpers.MoveCheckResult", () => {
	it("specifies possible values of a move check", () => {
		expect(MoveCheckResult.Free).toBeDefined();
		expect(MoveCheckResult.Blocked).toBeDefined();
		expect(MoveCheckResult.OutOfBounds).toBeDefined();
		expect(MoveCheckResult.EvadeUp).toBeDefined();
		expect(MoveCheckResult.EvadeDown).toBeDefined();
		expect(MoveCheckResult.EvadeLeft).toBeDefined();
		expect(MoveCheckResult.EvadeRight).toBeDefined();
	});
});
