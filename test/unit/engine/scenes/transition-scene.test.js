import TransitionScene from '/engine/scenes/transition-scene';

describe("TransitionScene", () => {
	it('can be instantiated without throwing exceptions', () => {
		expect(() => new TransitionScene()).not.toThrow();
	});
});

