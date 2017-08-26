import AbstractRenderer from "/engine/rendering/abstract-renderer";

describe("AbstractRenderer", () => {
	it("is an abstract class used to define the interface a renderer must implement", () => {
		const renderer = new AbstractRenderer();

		expect(() => renderer.redisplayTile()).not.toThrow();
		expect(() => renderer.redisplayRect()).not.toThrow();
		expect(() => renderer.redisplay()).not.toThrow();
		expect(() => renderer.renderTile()).not.toThrow();
		expect(() => renderer.renderImage()).not.toThrow();
		expect(() => renderer.renderImageData()).not.toThrow();
		expect(() => renderer.fillBlackRect()).not.toThrow();
		expect(renderer.imageFactory).toBe(null);
	});
});
