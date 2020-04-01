import GamesWonIsGreaterThan from "src/engine/script/conditions/games-won-is-greater-than";

describeCondition("GamesWonIsGreaterThan", (check, engine) => {
	it("checks if more than x games have been won", async () => {
		const condition: any = { opcode: GamesWonIsGreaterThan.Opcode, arguments: [10] };

		engine.persistentState.gamesWon = 5;
		expect(await check(condition)).toBeFalse();

		engine.persistentState.gamesWon = 10;
		expect(await check(condition)).toBeFalse();

		engine.persistentState.gamesWon = 11;
		expect(await check(condition)).toBeTrue();
	});
});
