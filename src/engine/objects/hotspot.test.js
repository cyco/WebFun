import Hotspot from "/engine/objects/hotspot";

describe('Hotspot', () => {
	it('right now it\'s a very simple class', () => {
		let hotspot = new Hotspot();

		expect(hotspot.enabled).toBeFalse();
		expect(hotspot.type).toBe(-1);
		expect(hotspot.arg).toBe(-1);
		expect(hotspot.x).toBe(-1);
		expect(hotspot.y).toBe(-1);
	});
});
