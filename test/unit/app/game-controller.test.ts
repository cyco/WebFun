import { Engine, GameType, Interface, Hero } from "src/engine";
import { GameController } from "src/app";
import { MainMenu, MainWindow } from "src/app/windows";
import { Mixer } from "src/app/audio";
import { SceneView } from "src/app/ui";
import { Settings } from "src";
import { Yoda } from "src/engine/type";
import * as AppAudioModule from "src/app/audio";
import * as AppCanvasRendererModule from "src/app/rendering/canvas";
import * as AppWindowModule from "src/app/windows";
import * as EngineModule from "src/engine";
import { Renderer } from "src/app/rendering/canvas";
import { TouchInputManager, DesktopInputManager } from "src/app/input";
import Loader from "src/app/loader";
import ResourceManager from "src/app/resource-manager";
import DebugInfoScene from "src/debug/debug-info-scene";

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
				expect(engineInterface.InputManager(null)).toBeInstanceOf(DesktopInputManager);
			});

			it("provides a renderer", () => {
				expect(engineInterface.Renderer(null)).toBe(mockRenderer);
			});

			it("provides a loader", () => {
				expect(engineInterface.Loader(null)).toBeInstanceOf(Loader);
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
			expect(engine.hero.addEventListener).toHaveBeenCalledWith(Hero.Event.HealthChanged, subject);
		});
	});

	describe("when created with mobile mode active", () => {
		beforeEach(() => {
			Settings.mobile = true;
			createSubject();
		});

		it("adds a class to the window", () => {
			expect(mockedWindow.classList).toContain("mobile");
		});

		it("creates a touch input controller", () => {
			expect(engineInterface.InputManager(null)).toBeInstanceOf(TouchInputManager);
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
			mockedWindow = element;
		}

		return element;
	}

	function mockEngine(): Engine {
		return {
			hero: { addEventListener: jasmine.createSpy() },
			sceneManager: { addOverlay: jasmine.createSpy() },
			assets: { populate: jasmine.createSpy() }
		} as any;
	}
});
