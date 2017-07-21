import Story from "/engine/story";

describe("Story", () => {
	it('is a simple container for seed, size and world size at the moment', () => {
		const story = new Story(1, 2, 3);
		expect(story.seed).toBe(1);
		expect(story.planet).toBe(2);
		expect(story.size).toBe(3);
	});
});
