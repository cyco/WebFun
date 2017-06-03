import Renderer from '/engine/rendering/renderer';

describe("Renderer", () => {
	it('is an abstract class used to define the interface a renderer must implement', () => {
		const renderer = new Renderer();

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
