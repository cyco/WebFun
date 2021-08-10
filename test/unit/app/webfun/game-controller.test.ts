import * as EngineModule from "src/engine";
import {
	ColorPalette,
	Engine,
	GameState,
	Hero,
	Interface,
	PaletteAnimation,
	Story
} from "src/engine";
import { GameController } from "src/app/webfun";
import * as AppWindowModule from "src/app/webfun/windows";
import { MainMenu, MainWindow } from "src/app/webfun/windows";
import * as AppAudioModule from "src/app/webfun/audio";
import { Mixer } from "src/app/webfun/audio";
import * as AppCanvasRendererModule from "src/app/webfun/rendering/canvas";
import { Renderer } from "src/app/webfun/rendering/canvas";
import { SceneView } from "src/app/webfun/ui";
import { InputManager } from "src/app/webfun/input";
import { Yoda } from "src/variant";
import { MapScene, ZoneScene } from "src/engine/scenes";
import DebugInfoScene from "src/app/webfun/debug/debug-info-scene";
import InventoryComponent from "src/app/webfun/ui/inventory";
import ResourceManager from "src/app/webfun/resource-manager";
import { Size, observable, EventTarget } from "src/util";
import * as LoaderModule from "src/app/webfun/loader";
import { Tile } from "src/engine/objects";
import Settings from "src/settings";
import { Data } from "src/engine/file-format";

describe("WebFun.App.GameController", () => {
	let subject: GameController;
	let mainMenu: MainMenu;
	let engine: Engine;
	let mockedWindow: HTMLElement;
	let mockRenderer: Renderer;
	let createElement: (tagName: string) => HTMLElement;
	let mockMixer: Mixer;
	let engineInterface: Interface;
	let mockedData: Data;
	let mockedPalette: ColorPalette;
	let mockedStory: Story;
	let mockSettings: Settings & EventTarget;

	beforeEach(() => {
		createElement = document.createElement.bind(document);
	});

	afterEach(() => {
		(window as any).engine = null;
	});

	describe("when created", () => {
		beforeEach(() => {
			createSubject();
		});

		describe("and a new game is started", () => {
			let mockedPaletteAnimation: PaletteAnimation;

			beforeEach(async () => {
				mockedStory = { generate: jasmine.createSpy() } as any;
				mockedPaletteAnimation = {} as any;
				spyOn(EngineModule, "PaletteAnimation").and.returnValue(mockedPaletteAnimation);
				(engine.assets.find as jasmine.Spy).and.returnValue({ size: new Size(9, 9) });
				await subject.newStory();
			});

			describe("it creates a new engine", () => {
				it("provides a input manager", () => {
					expect(engineInterface.InputManager(null)).toBeInstanceOf(InputManager);
				});

				it("provides a renderer", () => {
					expect(engineInterface.Renderer(null)).toBe(mockRenderer);
				});

				it("provides a scene manager", () => {
					expect(engineInterface.SceneManager()).toBe(engine.sceneManager);
				});

				it("provides a resource manager", () => {
					expect(engineInterface.ResourceManager()).toBeInstanceOf(ResourceManager);
				});

				it("provides a mixer", () => {
					expect(engineInterface.Mixer()).toBe(mockMixer);
				});
			});

			it("listens for changes to hero's health", () => {
				expect(engine.hero.addEventListener).toHaveBeenCalledWith(
					Hero.Event.HealthDidChange,
					subject
				);
			});

			it("listens for item activate events", () => {
				expect((mockedWindow as any).inventory.addEventListener).toHaveBeenCalledWith(
					InventoryComponent.Events.ItemActivated,
					subject
				);
			});

			describe("with drawDebugStats active", () => {
				beforeEach(async () => {
					engine.gameState = GameState.Stopped;
					subject.settings.drawDebugStats = true;
					(engine.metronome.stop as jasmine.Spy).and.returnValue(Promise.resolve(void 0));
					await subject.newStory();
				});

				it("adds an overlay to draw debug stats", () => {
					expect(engine.sceneManager.addOverlay).toHaveBeenCalledWith(jasmine.any(DebugInfoScene));
				});
			});

			describe("with debug mode active", () => {
				beforeEach(async () => {
					engine.gameState = GameState.Stopped;
					subject.settings.debug = true;
					(engine.metronome.stop as jasmine.Spy).and.returnValue(Promise.resolve(void 0));
					await subject.newStory();
				});

				it("stores the newly created engine globally", () => {
					expect((window as any).engine).toBe(engine);
				});
			});

			describe("and the game is running", () => {
				beforeEach(() => {
					engine.gameState = GameState.Running;
				});

				describe("and the scene manager shows a zone scene", () => {
					beforeEach(() => {
						(engine.metronome.stop as jasmine.Spy).calls.reset();
						(engine.sceneManager.pushScene as jasmine.Spy).calls.reset();
						engine.sceneManager.currentScene = new ZoneScene(engine);
					});

					describe("and the locator is activated in the inventory", () => {
						beforeEach(() => {
							subject.handleEvent(
								new CustomEvent(InventoryComponent.Events.ItemActivated, {
									detail: {
										item: {
											id: 9,
											hasAttributes(attr: number) {
												return (attr & Tile.Attributes.Map) === attr;
											}
										}
									}
								})
							);
						});

						it("shows the map scene", () => {
							expect(engine.sceneManager.pushScene).toHaveBeenCalledWith(jasmine.any(MapScene));
						});

						it("does not stop the metronome", () => {
							expect(engine.metronome.stop).not.toHaveBeenCalled();
						});
					});
				});
			});
		});
	});

	function createSubject() {
		mockMixer = {} as any;
		mainMenu = {} as any;
		mockRenderer = {} as any;
		mockSettings = observable({}) as any;
		engine = mockEngine();
		engine.settings = mockSettings;

		spyOn(AppWindowModule, "MainMenu").and.returnValue(mainMenu);
		spyOn(document, "createElement").and.callFake(mockElement as any);
		spyOn(EngineModule, "Engine").and.callFake((_, ifce: any) => {
			engineInterface = ifce;
			return engine;
		});
		spyOn(AppAudioModule, "Mixer").and.returnValue(mockMixer);
		spyOn(AppCanvasRendererModule, "Renderer").and.returnValue(mockRenderer);

		subject = new GameController(
			Yoda,
			{ variant: "yoda", data: "", exe: "", sfx: "", sfxFormat: "" },
			mockSettings
		);
		subject.settings = {} as any;
	}

	function mockElement(tagName: string) {
		const element = createElement("div") as any;

		if (tagName === SceneView.tagName) {
			element.manager = engine.sceneManager;
		}

		if (tagName === MainWindow.tagName) {
			element.content = createElement("div");
			element.mainContent = createElement("div");
			element.inventory = {
				addEventListener: jasmine.createSpy(),
				removeEventListener: jasmine.createSpy()
			};
			element.weapon = {
				addEventListener: jasmine.createSpy(),
				removeEventListener: jasmine.createSpy()
			};
			mockedWindow = element;
		}

		return element;
	}

	function mockEngine(): Engine {
		mockedData = { sounds: [], zones: [], tiles: [], puzzles: [], characters: [] } as any;
		mockedPalette = {} as any;
		spyOn(LoaderModule, "default").and.returnValue({
			load: function () {
				const loader = this;
				const loadEvent = new CustomEvent("load", {
					detail: { data: mockedData, palette: mockedPalette }
				});
				setTimeout(() => loader.onload(loadEvent));
			}
		} as any);

		return {
			hero: { addEventListener: jasmine.createSpy(), removeEventListener: jasmine.createSpy() },
			sceneManager: {
				addOverlay: jasmine.createSpy(),
				pushScene: jasmine.createSpy(),
				clear: jasmine.createSpy(),
				currentScene: null,
				popScene: jasmine.createSpy()
			},
			inventory: { removeAllItems: jasmine.createSpy(), removeEventListener: jasmine.createSpy() },
			assets: { populate: jasmine.createSpy(), find: jasmine.createSpy(), getAll: (): any[] => [] },
			metronome: { start: jasmine.createSpy(), stop: jasmine.createSpy() },
			persistentState: { gamesWon: 0 },
			world: { findLocationOfZone: jasmine.createSpy() },
			inputManager: { addListeners: jasmine.createSpy() },
			camera: {},
			variant: {
				createNewStory() {
					return mockedStory;
				}
			},
			spu: { prepareExecution: jasmine.createSpy() },
			teardown: jasmine.createSpy()
		} as any;
	}
});
