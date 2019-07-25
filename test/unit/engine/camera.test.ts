import Camera from "src/engine/camera";
import { Hero } from "src/engine";

describe("WebFun.Engine.Camera", () => {
	it("manages the view on to a scene, all coordinates are expressed in tiles", () => {
		const camera = new Camera();

		expect(camera.size.width).toBe(9);
		expect(camera.size.height).toBe(9);

		expect(camera.zoneSize.width).toBe(9);
		expect(camera.zoneSize.height).toBe(9);
	});

	it("has an update method to keep the hero centered", () => {
		const hero: Hero = { location: { x: 9, y: 9 } } as any;
		const camera = new Camera();
		camera.zoneSize = { width: 18, height: 18 } as any;
		camera.hero = hero;

		camera.update(0);
		expect(camera.offset.x).toBe(-5);
		expect(camera.offset.y).toBe(-5);

		hero.location.x = 10;
		camera.update(0);
		expect(camera.offset.x).toBe(-6);
		expect(camera.offset.y).toBe(-5);
	});

	it("makes sure that the view never leaves view bounds", () => {
		const hero: Hero = { location: { x: 0, y: 0 } } as any;
		const camera = new Camera();
		camera.zoneSize = { width: 18, height: 18 } as any;
		camera.hero = hero;

		camera.update(0);
		expect(camera.offset.x).toBe(0);
		expect(camera.offset.y).toBe(0);

		hero.location.x = 17;
		hero.location.y = 17;

		camera.update(0);
		expect(camera.offset.x).toBe(-9);
		expect(camera.offset.y).toBe(-9);
	});
});
