import NPC from "src/engine/objects/npc";

describe("NPC", () => {
	it("is a class representing an npc", () => {
		const npc = new NPC();
		expect(npc.enabled).toBeTrue();
	});
});
