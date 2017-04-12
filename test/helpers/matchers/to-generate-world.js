import addMatchers from 'add-matchers';
import { WorldGenerator } from '/engine/generation';

addMatchers({
	toGenerateWorld: (sample, { seed, size, planet, data }) => {
		window.logging = false;

		let worldGenerator = new WorldGenerator(seed, size, planet, { data });
		worldGenerator.generate();

		const world = worldGenerator.world;
		for (let i = 0; i < 100; i++) {
			let thing = world[i];
			expect(thing.zoneId).toBe(sample[i * 10]);
			expect(thing.zoneType).toBe(sample[i * 10 + 1]);

			if (thing.zoneId !== sample[i * 10]) return false;
			if (thing.zoneType !== sample[i * 10 + 1]) return false;
			// if (thing.findItemID !== sample[i * 10 + 6]) return;
			// if (thing.requiredItemID !== sample[i * 10 + 4]) return;
		}
		window.logging = false;
		return true;
	}
});
