import { Condition } from '/engine/objects';
import * as GamesWonIs from './games-won-is';

describeCondition('GamesWonIs', (check, engine) => {
	it('checks if exactly x games have been won', () => {
		const condition = new Condition();
		condition._opcode = GamesWonIs.Opcode;
		condition._arguments = [10];

		engine.persistentState.gamesWon = 5;
		expect(check(condition)).toBeFalse();

		engine.persistentState.gamesWon = 10;
		expect(check(condition)).toBeTrue();
	});
});
