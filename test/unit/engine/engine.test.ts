import { Engine, SceneManager } from "src/engine";
import { Yoda } from "src/engine/type";
import { Point, dispatch } from "src/util";
import Settings from "src/settings";
import * as Scenes from "src/engine/scenes";
import { SpeechScene, PickupScene } from "src/engine/scenes";
import { Tile } from "src/engine/objects";
import Sector from "src/engine/sector";

describe("Engine", () => {
	let subject: Engine;
	let sceneManager: SceneManager;

	beforeEach(() => {
		sceneManager = {
			update() {},
			render() {},
			presentScene() {}
		} as any;
		subject = new Engine(Yoda, { SceneManager: () => sceneManager });
	});

	it("it holds all state required for running a game", () => {
		expect(subject).toHaveMember("metronome");
		expect(subject).toHaveMember("sceneManager");
		expect(subject).toHaveMember("renderer");
		expect(subject).toHaveMember("inputManager");
	});

	it("passes render and update requests on to the scene manager", () => {
		let renderPassedOn = false;
		let updatePassedOn = false;

		sceneManager.update = () => ((updatePassedOn = true), Promise.resolve(void 0));
		sceneManager.render = () => (renderPassedOn = true);

		subject.update(1);
		subject.render();

		expect(renderPassedOn).toBeTrue();
		expect(updatePassedOn).toBeTrue();
	});

	describe("update", () => {
		it("prints a warning if it's entered again before finishing", () => {
			let resolve: any;
			const promise: Promise<void> = new Promise(r => {
				resolve = r;
			});

			spyOn(console, "warn");
			spyOn(sceneManager, "update").and.returnValue(promise);

			subject.update(1);
			expect(sceneManager.update).toHaveBeenCalled();
			expect(console.warn).not.toHaveBeenCalled();
			subject.update(1);

			expect(sceneManager.update).toHaveBeenCalled();
			expect(console.warn).toHaveBeenCalled();

			resolve();
		});

		it("prints a warning if the update fails", async () => {
			let reject: any;
			const promise: Promise<void> = new Promise((_, r) => {
				reject = r;
			});

			spyOn(console, "warn");
			spyOn(sceneManager, "update").and.returnValue(promise);

			subject.update(1);
			reject({});
			await dispatch(() => void 0);
			expect(console.warn).toHaveBeenCalled();
		});
	});

	describe("showing text", () => {
		let scene: SpeechScene;

		beforeEach(() => {
			scene = {} as any;
			spyOn(Scenes, "SpeechScene").and.returnValue(scene as any);
			spyOn(sceneManager, "presentScene").and.returnValue(Promise.resolve());
		});

		it("does nothing if spoken text is skipped according to debug setting", async () => {
			Settings.skipDialogs = true;
			await subject.speak("Some text!", new Point(4, 5));
			expect(Scenes.SpeechScene).not.toHaveBeenCalled();
		});

		it("has a function to show a speech bubble", async () => {
			Settings.skipDialogs = false;
			await subject.speak("Test Text", new Point(5, 3));
			expect(Scenes.SpeechScene).toHaveBeenCalled();
			expect(scene.text).toEqual("Test Text");
			expect(scene.location).toEqual(new Point(5, 3));
			expect(sceneManager.presentScene).toHaveBeenCalledWith(scene);
		});
	});

	describe("dropping items", () => {
		let scene: PickupScene;
		let tile: Tile;
		let sectorMock: Sector;

		beforeEach(() => {
			tile = {} as any;
			scene = {} as any;
			sectorMock = {} as any;
			subject.currentWorld = { findSectorContainingZone: () => sectorMock } as any;
			spyOn(Scenes, "PickupScene").and.returnValue(scene as any);
			spyOn(sceneManager, "presentScene").and.returnValue(Promise.resolve());
			spyOn(subject.inventory, "addItem");
		});

		it("just adds the item to the inventory if items are picked up automatically according to debug setting", async () => {
			Settings.pickupItemsAutomatically = true;
			await subject.dropItem(tile, new Point(4, 5));
			expect(Scenes.PickupScene).not.toHaveBeenCalled();
			expect(subject.inventory.addItem).toHaveBeenCalledWith(tile);
		});

		it("solves the current zone after pick up if the item is the sector's findItem", async () => {
			sectorMock.findItem = tile;

			Settings.pickupItemsAutomatically = true;
			await subject.dropItem(tile, new Point(4, 5));
			expect(Scenes.PickupScene).not.toHaveBeenCalled();
			expect(subject.inventory.addItem).toHaveBeenCalledWith(tile);
			expect(sectorMock.solved1).toBeTruthy();
		});

		it("shows a pick up scene at the specified location", async () => {
			Settings.pickupItemsAutomatically = false;
			await subject.dropItem(tile, new Point(5, 3));
			expect(Scenes.PickupScene).toHaveBeenCalled();
			expect(scene.tile).toBe(tile);
			expect(scene.location).toEqual(new Point(5, 3));
			expect(sceneManager.presentScene).toHaveBeenCalledWith(scene);
		});
	});
});
