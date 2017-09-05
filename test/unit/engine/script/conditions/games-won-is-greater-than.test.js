import { Condition } from "src/engine/objects";
import * as GamesWonIsGreaterThan from "src/engine/script/conditions/games-won-is-greater-than";

describeCondition("GamesWonIsGreaterThan", (check, engine) => {
	it("checks if more than x games have been won", () => {
		const condition = new Condition();
		condition._opcode = GamesWonIsGreaterThan.Opcode;
		condition._arguments = [ 10 ];

		engine.persistentState.gamesWon = 5;
		expect(check(condition)).toBeFalse();

		engine.persistentState.gamesWon = 10;
		expect(check(condition)).toBeFalse();

		engine.persistentState.gamesWon = 11;
		expect(check(condition)).toBeTrue();
	});
});
