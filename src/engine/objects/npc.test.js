import NPC from '/engine/objects/npc';

describe("NPC", () => {
	it('is a class representing an npc', () => {
		const intValues = {
			face: null,
			x: 4,
			y: 3,
			unknown1: null,
			unknown2: null,
			unknown3: null
		};

		const npc = new NPC(intValues);

		expect(npc.x).toBe(4);
		expect(npc.y).toBe(3);
		expect(npc.enabled).toBeTrue();
	});
});
