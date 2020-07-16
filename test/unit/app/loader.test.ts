import Loader from "src/app/loader";
import { ResourceManager } from "src/engine";

xdescribe("WebFun.App.Loader", () => {
	let subject: Loader;

	it("is a class that loads game data in multiple stages while providing an initial image as soon as possible", () => {
		expect(Loader).toBeAClass();
	});

	describe("when load is called", () => {
		let resourceManager: ResourceManager;
		beforeEach(() => {});

		it("uses the resource manager to fetch the main data file", () => {
			expect(resourceManager.loadGameFile).toHaveBeenCalled();
		});

		describe("and the resource manager reports an error while loading the main file", () => {
			it("sends and error event", () => {});
			it("rejects the loading promise", () => {});
		});

		describe("and the resource manager reports a new progress on loading the main file", () => {
			it("triggers a progress event", () => {});
			it("takes the remaining stages into account when reporting the progress", () => {});
		});

		describe("and the resource manager succeeds in loading the main file", () => {
			it("parses the game file", () => {});
			it("continues to load the color palette", () => {});

			describe("and the color palette is loaded", () => {
				describe("and the setup image can be decoded", () => {
					it("reports the image using an event", () => {});

					it("continues to convert instantiate entities from the raw game data", () => {});

					describe("then it continues to preload sounds", () => {
						describe("when a sound fails to load", () => {
							it("reports an error", () => {});
						});

						describe("when all sounds have been loaded", () => {
							it("reports success by triggering the `load` event", () => {});
						});
					});
				});

				describe("and the setup image can _not_ be decoded", () => {
					it("reports the fialure using an event", () => {});
				});
			});
		});
	});
});
