import GameEventHandler from "src/app/game-event-handler";
import { Engine, Hero } from "src/engine";
import { SceneView } from "src/app/ui";

xdescribe("WebFun.App.GameEventHandler", () => {
	let subject: GameEventHandler;
	let engine: Engine;
	let sceneView: SceneView;

	beforeEach(() => {
		engine = {} as any;
		sceneView = {} as any;
		subject = new GameEventHandler();
	});

	it("is a class that reacts to events happening during gameplay", () => {
		expect(GameEventHandler).toBeAClass();
	});

	describe("When a `HealthDidChange` event is triggered", () => {
		it("does nothing if the hero's health is above zero", () => {});

		it("shows the lose scene if the hero's health is below 0", () => {});

		it("revives the hero if he has a _SpiritHeart_", () => {});

		function trigger(health: number) {
			subject.handleEvent(
				engine,
				sceneView,
				new CustomEvent(Hero.Event.HealthDidChange, { health } as any)
			);
		}
	});

	describe("`ItemActivated` event", () => {});

	describe("`ItemPlaced` event", () => {});
});
