import LoseScene from "src/engine/scenes/lose-scene";
import * as ZoneScene from "src/engine/scenes/zone-scene";
import { Engine } from "src/engine";
import { Zone } from "src/engine/objects";

describe("WebFun.Engine.Scenes.LoseScene", () => {
	let subject: LoseScene;
	let engine: Engine;
	beforeEach(() => {
		subject = new LoseScene();
		subject.engine = engine = ({
			hero: { visible: true },
			assets: { find: jasmine.createSpy() },
			metronome: { stop: jasmine.createSpy() }
		} as any) as Engine;
	});

	describe("when the scene is shown", () => {
		let zoneSceneMock: ZoneScene.default;
		let mockedLoseZone: Zone;

		beforeEach(() => {
			mockedLoseZone = {} as any;
			zoneSceneMock = ({
				willShow: jasmine.createSpy(),
				didShow: jasmine.createSpy(),
				render: jasmine.createSpy(),
				willHide: jasmine.createSpy(),
				didHide: jasmine.createSpy()
			} as any) as ZoneScene.default;
			spyOn(ZoneScene, "default").and.returnValue(zoneSceneMock);

			(subject.engine.assets as any).find.and.returnValue(mockedLoseZone);

			subject.willShow();
			subject.didShow();
		});

		it("hides the hero", () => {
			expect(engine.hero.visible).toBeFalse();
		});

		it("stops the metronome", () => {
			expect(engine.metronome.stop).toHaveBeenCalled();
		});

		it("creates a zone scene to display the `lost` scene", () => {
			expect(ZoneScene.default).toHaveBeenCalled();
			expect(zoneSceneMock.zone).toBe(mockedLoseZone);
		});

		it("acts as a proxy for a zone scene", () => {
			expect(zoneSceneMock.willShow).toHaveBeenCalled();
			expect(zoneSceneMock.didShow).toHaveBeenCalled();
		});

		it("proxies render calls to the zone scene", () => {
			const mockedRenderer: any = {};
			subject.render(mockedRenderer);
			expect(zoneSceneMock.render).toHaveBeenCalled();
		});

		describe("and the zone is removed from the stack", () => {
			beforeEach(() => {
				subject.willHide();
				subject.didHide();
			});

			it("calls the appropriate methods on the zone scene", () => {
				expect(zoneSceneMock.willHide).toHaveBeenCalled();
				expect(zoneSceneMock.didHide).toHaveBeenCalled();
			});
		});

		it("does not perform update", () => {
			expect(() => subject.update(1)).not.toThrow();
		});
	});

	it("is opaque so the scene below is not visible", () => {
		expect(subject.isOpaque()).toBeFalse();
	});
});
