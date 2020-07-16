import Loader, { Events } from "src/app/loader";
import { ResourceManager, GameData } from "src/engine";
import { Mixer } from "src/app/audio";
import { dispatch, InputStream } from "src/util";
import * as EngineModule from "src/engine";

describe("WebFun.App.Loader", () => {
	let subject: Loader;

	it("is a class that loads game data in multiple stages while providing an initial image as soon as possible", () => {
		expect(Loader).toBeAClass();
	});

	describe("when a loader is instantiated", () => {
		let resourceManager: ResourceManager;
		let mixer: Mixer;
		let progressHandler: any, failHandler: any, loadHandler: any;
		beforeEach(() => {
			resourceManager = {
				loadGameFile: jasmine.createSpy("loadGameFile"),
				loadPalette: jasmine.createSpy("loadPalette"),
				loadSound: jasmine.createSpy("loadSound")
			} as any;
			mixer = {
				prepare: jasmine.createSpy("prepare")
			} as any;

			progressHandler = jasmine.createSpy("progressHandler");
			failHandler = jasmine.createSpy("failHandler");
			loadHandler = jasmine.createSpy("loadHandler");

			subject = new Loader(resourceManager, mixer);
			subject.addEventListener(Events.Progress, progressHandler);
			subject.addEventListener(Events.Fail, failHandler);
			subject.addEventListener(Events.Load, loadHandler);
		});

		afterEach(() => {
			subject.removeEventListener(Events.Progress, progressHandler);
			subject.removeEventListener(Events.Fail, failHandler);
			subject.removeEventListener(Events.Load, loadHandler);
		});

		describe("and `load` is called", () => {
			let progressCB: (p: number) => void;
			let resolveCB: (r: any) => void;
			let rejectCB: (r: any) => void;

			beforeEach(() => {
				(resourceManager.loadGameFile as jasmine.Spy).and.callFake((progress: any) => {
					progressCB = progress;
					return new Promise((res, rej) => {
						resolveCB = res;
						rejectCB = rej;
					});
				});

				subject.load();
			});

			it("uses the resource manager to fetch the main data file", () => {
				expect(resourceManager.loadGameFile).toHaveBeenCalled();
			});

			describe("and the resource manager reports an error while loading the main file", () => {
				beforeEach(async () => {
					await dispatch(() => rejectCB("Simulated Error"));
				});

				it("sends and error event", () => {
					expect(failHandler).toHaveBeenCalled();
				});
			});

			describe("and the resource manager reports a new progress on loading the main file", () => {
				beforeEach(() => {
					progressCB(0.5);
				});

				afterEach(() => {
					subject.removeEventListener(Events.Progress, progressHandler);
				});

				it("triggers a progress event", () => {
					expect(progressHandler).toHaveBeenCalled();
				});

				it("takes the remaining stages into account when reporting the progress", () => {
					const event = progressHandler.calls.argsFor(0)[0];
					expect(event.detail.progress).toEqual(0.5 / 9);
				});
			});

			describe("and the resource manager succeeds in loading the main file", () => {
				let gameDataStream: InputStream;
				let decodedStream: any;
				beforeEach(async () => {
					gameDataStream = {} as any;
					decodedStream = {};
					spyOn(EngineModule, "readGameDataFile").and.returnValue(decodedStream);

					(resourceManager.loadPalette as jasmine.Spy).and.callFake((progress: any) => {
						progressCB = progress;
						return new Promise((res, rej) => {
							resolveCB = res;
							rejectCB = rej;
						});
					});

					await dispatch(() => resolveCB(gameDataStream));
				});

				it("parses the game file", () => {
					expect(EngineModule.readGameDataFile).toHaveBeenCalled();
				});

				it("continues to load the color palette", () => {
					expect(resourceManager.loadPalette).toHaveBeenCalled();
				});

				describe("and the color palette is loaded", () => {
					describe("and the setup image can be decoded", () => {
						let palette: any;
						let setupImageHandler: any;
						let gameData: GameData;
						beforeEach(() => {
							gameData = {} as any;
							spyOn(EngineModule, "GameData").and.callFake(() => gameData);
							(mixer.prepare as jasmine.Spy).and.callFake(input => Promise.resolve(input));
							setupImageHandler = jasmine.createSpy("setupImageHandler");
							palette = {};
							decodedStream.setup = {};
							subject.addEventListener(Events.DidLoadSetupImage, setupImageHandler);
						});

						afterEach(async () => {
							await dispatch(() => resolveCB(palette));
							subject.removeEventListener(Events.DidLoadSetupImage, setupImageHandler);
						});

						it("reports the image using an event", async () => {
							await dispatch(() => resolveCB(palette));
							expect(setupImageHandler).toHaveBeenCalled();
						});

						describe("then it continues to preload sounds", () => {
							let resolveFunctions: Function[];
							let progressFunctions: Function[];
							beforeEach(async () => {
								resolveFunctions = [];
								progressFunctions = [];
								(gameData as any).sounds = [
									{ file: null, name: "Missing" },
									{ file: "MySound.wav" }
								];
								(resourceManager.loadSound as jasmine.Spy).and.callFake(
									(_, progressHandler) =>
										new Promise((res, rej) => {
											progressFunctions.push(progressHandler);
											resolveFunctions.push(res);
										})
								);
								await dispatch(() => resolveCB(palette));
							});

							it("uses the reosource manager to load sounds from a server", () => {
								expect(resourceManager.loadSound).toHaveBeenCalledWith(
									"MySound.wav",
									jasmine.anything()
								);
							});

							it("skips sounds without file", () => {
								expect(resourceManager.loadSound).not.toHaveBeenCalledWith(
									null,
									jasmine.anything()
								);
							});

							describe("when all sounds have been loaded", () => {
								beforeEach(async () => {
									progressFunctions.forEach(h => h(1));
									resolveFunctions.forEach(resolve => resolve({}));
									await dispatch(() => void 0);
								});

								it("reports success by triggering the `load` event", () => {
									expect(loadHandler).toHaveBeenCalled();
								});
							});
						});
					});

					describe("and the setup image can _not_ be decoded", () => {
						let palette: any;
						beforeEach(async () => {
							palette = {};
							await dispatch(() => resolveCB(palette));
						});

						it("reports the failure using an event", () => {
							const event = failHandler.calls.argsFor(0)[0];
							expect(event.detail.reason).toEqual("Setup image not found in game file!");
						});
					});
				});
			});
		});
	});
});
