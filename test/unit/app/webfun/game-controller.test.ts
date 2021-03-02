import {
	Engine,
	Interface,
	Hero,
	GameState,
	GameData,
	ColorPalette,
	Story,
	PaletteAnimation
} from "src/engine";
import { GameController } from "src/app/webfun";
import { MainMenu, MainWindow } from "src/app/webfun/windows";
import { Mixer } from "src/app/webfun/audio";
import { Renderer } from "src/app/webfun/rendering/canvas";
import { SceneView } from "src/app/webfun/ui";
import { Settings } from "src";
import { InputManager } from "src/app/webfun/input";
import { Yoda } from "src/engine/variant";
import { ZoneScene, MapScene } from "src/engine/scenes";
import * as AppAudioModule from "src/app/webfun/audio";
import * as AppCanvasRendererModule from "src/app/webfun/rendering/canvas";
import * as AppWindowModule from "src/app/webfun/windows";
import * as EngineModule from "src/engine";
import DebugInfoScene from "src/app/webfun/debug/debug-info-scene";
import InventoryComponent from "src/app/webfun/ui/inventory";
import ResourceManager from "src/app/webfun/resource-manager";
import { Size } from "src/util";
import * as LoaderModule from "src/app/webfun/loader";
import { Tile } from "src/engine/objects";

describe("WebFun.App.GameController", () => {
	let originalSettings: any;
	let subject: GameController;
	let mainMenu: MainMenu;
	let engine: Engine;
	let mockedWindow: HTMLElement;
	let mockRenderer: Renderer;
	let createElement: (tagName: string) => HTMLElement;
	let mockMixer: Mixer;
	let engineInterface: Interface;
	let mockedData: GameData;
	let mockedPalette: ColorPalette;
	let mockedStory: Story;

	beforeEach(() => {
		originalSettings = Object.assign({}, Settings);
		createElement = document.createElement.bind(document);
	});

	afterEach(() => {
		localStorage.clear();
		Object.assign(Settings, originalSettings);
	});

	describe("when created", () => {
		beforeEach(() => {
			createSubject();
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

		describe("a new game is started", () => {
			let mockedPaletteAnimation: PaletteAnimation;

			beforeEach(async () => {
				mockedStory = { generateWorld: jasmine.createSpy() } as any;
				mockedPaletteAnimation = {} as any;
				spyOn(EngineModule, "PaletteAnimation").and.returnValue(mockedPaletteAnimation);
				(engine.assets.find as jasmine.Spy).and.returnValue({ size: new Size(9, 9) });
				await subject.newStory();
			});

			it("listens for item activate events", () => {
				expect((mockedWindow as any).inventory.addEventListener).toHaveBeenCalledWith(
					InventoryComponent.Events.ItemActivated,
					subject
				);
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

	describe("when created with drawDebugStats active", () => {
		beforeEach(() => {
			Settings.drawDebugStats = true;
			createSubject();
		});

		it("adds an overlay to draw debug stats", () => {
			expect(engine.sceneManager.addOverlay).toHaveBeenCalledWith(jasmine.any(DebugInfoScene));
		});
	});

	describe("when created with debug mode active", () => {
		beforeEach(() => {
			Settings.debug = true;
			createSubject();
		});
		afterEach(() => {
			delete (window as any).engine;
		});

		it("stores the newly created engine globally", () => {
			expect((window as any).engine).toBe(engine);
		});
	});

	function createSubject() {
		mockMixer = {} as any;
		mainMenu = {} as any;
		mockRenderer = {} as any;
		engine = mockEngine();

		spyOn(AppWindowModule, "MainMenu").and.returnValue(mainMenu);
		spyOn(document, "createElement").and.callFake(mockElement as any);
		spyOn(EngineModule, "Engine").and.callFake((_, ifce: any) => {
			engineInterface = ifce;
			return engine;
		});
		spyOn(AppAudioModule, "Mixer").and.returnValue(mockMixer);
		spyOn(AppCanvasRendererModule, "Renderer").and.returnValue(mockRenderer);

		subject = new GameController(Yoda, { data: "", palette: "", sfx: "" });
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
		mockedData = {} as any;
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
			hero: { addEventListener: jasmine.createSpy() },
			sceneManager: {
				addOverlay: jasmine.createSpy(),
				pushScene: jasmine.createSpy(),
				clear: jasmine.createSpy(),
				currentScene: null,
				popScene: jasmine.createSpy()
			},
			inventory: { removeAllItems: jasmine.createSpy() },
			assets: { populate: jasmine.createSpy(), find: jasmine.createSpy() },
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
			spu: { prepareExecution: jasmine.createSpy() }
		} as any;
	}
});
