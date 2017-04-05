import GameState from '/engine/game-state';
import Hero from '/engine/hero';
import Inventory from '/engine/inventory';

describe('GameState', () => {
	it('is a class that holds the game state (similar to Story)', () => {
		expect(typeof GameState).toBe('function');

		let state = new GameState();
		expect(state.worlds.length).toBe(0);
		expect(state.hero instanceof Hero).toBe(true);
		expect(state.inventory instanceof Inventory).toBe(true);
	});

	it('does not have an ending until a world is generated', () => {
		let state = new GameState();
		expect(state.ending).toBe(null);
	});
});
