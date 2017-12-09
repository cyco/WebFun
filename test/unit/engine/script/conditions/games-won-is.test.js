import { Condition } from "src/engine/objects";
import GamesWonIs from "src/engine/script/conditions/games-won-is";

describeCondition("GamesWonIs", (check, engine) => {
	it("checks if exactly x games have been won", async (done) => {
		const condition = new Condition();
		condition._opcode = GamesWonIs.Opcode;
		condition._arguments = [10];

		engine.persistentState.gamesWon = 5;
		expect(await check(condition)).toBeFalse();

		engine.persistentState.gamesWon = 10;
		expect(await check(condition)).toBeTrue();

		done();
	});
});
