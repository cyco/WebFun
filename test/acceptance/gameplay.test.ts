import { getFixtureContent } from "test/helpers";
import loadGameData from "test/helpers/game-data";
import { ReplayingInputManager } from "src/debug/automation";
import { Yoda } from "src/engine/type";
import { ZoneScene } from "src/engine/scenes";
import { CanvasRenderer } from "src/app/rendering";
import { SceneView } from "src/app/ui";
import { ComponentRegistry } from "src/ui";
import { GameData, Engine, Story } from "src/engine";
import { Planet, WorldSize } from "src/engine/types";
import { PaletteAnimation } from "src/engine/rendering";
import { Loader } from "src/engine/loader";
import { Renderer as DummyRenderer } from "src/engine/dummy-interface";
import Settings from "src/settings";
import { dispatch } from "src/util";

const FiveMinutes = 5 * 60 * 1000;

declare var withTimeout: (t: number, block: () => void) => () => void;

describe(
	"WebFun.Acceptance.Gameplay",
	withTimeout(FiveMinutes, () => {
		let rawData: any, paletteData: any;

		beforeAll(async done => {
			const registry = ComponentRegistry.sharedRegistry;
			if (!registry.contains(SceneView)) registry.registerComponent(SceneView);

			rawData = await loadGameData(Yoda);
			paletteData = Uint32Array.paletteFromArrayBuffer(await getFixtureData("yoda.pal"));

			done();
		});

		it("plays through 0xDEAD", async endTest => {
			try {
				const { cleanup, engine, error } = await runGame(
					0xdead,
					Planet.ENDOR,
					WorldSize.Large,
					"input-1",
					true
				);

				expect(error).toBeNull();
				expect(engine.inventory.contains(engine.story.goal.item1)).toBeTrue();

				cleanup().then(endTest);
			} catch (e) {
				console.log("error", e);
			}
		});

		async function runGame(
			seed: number,
			planet: Planet,
			size: WorldSize,
			input: string,
			debug: boolean = false
		): Promise<{ engine: Engine; cleanup: Function; error: any }> {
			return new Promise(async resolve => {
				let engine: Engine,
					inputManager: ReplayingInputManager,
					sceneView: SceneView,
					onInputEnd: () => void;

				Settings.debug = debug;
				Settings.skipDialogs = true;
				Settings.skipTransitions = true;
				Settings.pickupItemsAutomatically = true;

				const cleanup = async () => {
					try {
						if (!engine) {
							return;
						}

						engine.metronome.stop();
						await dispatch(() => void 0, 5);

						engine.inputManager.removeListeners();
						inputManager.removeEventListener(ReplayingInputManager.Event.InputEnd, onInputEnd);
						inputManager.input = [];
						engine.sceneManager.clear();

						engine.currentWorld = null;
						engine.currentZone = null;
						engine.data = null;
						engine.hero.appearance = null;
						engine.hero = null;
						engine.inputManager.engine = null;
						engine.inputManager = null;
						engine.loader = null;
						engine.metronome.onrender = (): void => void 0;
						engine.metronome.ontick = (): void => void 0;
						engine.metronome = null;
						engine.palette = null;
						engine.renderer = null;
						engine.sceneManager.engine = null;
						engine.sceneManager = null;
						engine.story = null;
						sceneView.remove();
					} catch (e) {
						console.log("cleanup failed", e);
					}
				};

				try {
					sceneView = document.createElement(SceneView.tagName);
					inputManager = new ReplayingInputManager();
					engine = new Engine(Yoda, {
						InputManager: () => inputManager,
						Renderer: () =>
							debug ? new CanvasRenderer.Renderer(sceneView.canvas) : new DummyRenderer(),
						Loader: () => (({} as unknown) as Loader),
						SceneManager: () => sceneView.manager
					});

					document.body.appendChild(sceneView);

					engine.data = new GameData(rawData);
					engine.palette = new PaletteAnimation(paletteData);

					const story = new Story(seed, planet, size);
					story.generateWorld(engine.data);
					engine.story = story;

					engine.metronome.tickDuration = 1;
					engine.metronome.ontick = (delta: number) => engine.update(delta);
					engine.metronome.onrender = () => engine.render();

					sceneView.manager.engine = engine;
					const zone = engine.data.zones.find(z => z.isLoadingZone());
					const zoneScene = new ZoneScene(engine, zone);
					engine.currentZone = zone;
					engine.currentWorld = engine.world.locationOfZone(zone) ? engine.world : null;
					engine.hero.appearance = engine.data.characters.find(c => c.isHero());
					engine.sceneManager.pushScene(zoneScene);

					inputManager.engine = engine;
					inputManager.input = getFixtureContent(input).split(" ");
					onInputEnd = () => resolve({ engine, cleanup, error: null });
					inputManager.addEventListener(ReplayingInputManager.Event.InputEnd, onInputEnd);
					engine.inputManager.addListeners();
					engine.metronome.start();
				} catch (e) {
					resolve({ engine, cleanup, error: e });
				}
			});
		}
	})
);
