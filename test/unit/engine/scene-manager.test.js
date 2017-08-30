import SceneManager from "/engine/scene-manager";
import { Scene } from "/engine/scenes";

describe("SceneManager", () => {
	let subject;
	beforeEach(() => {
		subject = new SceneManager();
	});

	it("is in charge of managing the stack of scenes visible during gameplay", () => {
		const scene1 = new (class extends Scene {
		})();
		const scene2 = new (class extends Scene {
		})();

		subject.pushScene(scene1);
		subject.pushScene(scene2);

		expect(subject.currentScene).toBe(scene2);

		subject.popScene();
		expect(subject.currentScene).toBe(scene1);
	});

	describe("clear", () => {
		it("just pops off all scenes", () => {
			const AScene = class extends Scene {
			};

			subject.pushScene(new AScene());
			subject.pushScene(new AScene());
			subject.pushScene(new AScene());
			subject.pushScene(new AScene());

			subject.clear();
			expect(subject.currentScene).toBe(null);
		});
	});

	it("passes calls to update to the current scene", () => {
		const AScene = class extends Scene {
		};

		const scene1 = new AScene();
		const scene2 = new AScene();

		subject.pushScene(scene1);
		subject.pushScene(scene2);

		spyOn(scene1, "update");
		spyOn(scene2, "update");

		subject.update(0);

		expect(scene1.update).not.toHaveBeenCalled();
		expect(scene2.update).toHaveBeenCalled();
	});

	it("passes 'render' calls to all scenes until an opaque scene is encountered", () => {
		const AScene = class extends Scene {
			isOpaque() {
				return false;
			}
		};
		const OpaqueScene = class extends Scene {
			isOpaque() {
				return true;
			}
		};

		const scene1 = new AScene();
		const scene2 = new OpaqueScene();
		const scene3 = new AScene();

		subject.pushScene(scene1);
		subject.pushScene(scene2);
		subject.pushScene(scene3);

		spyOn(scene1, "render");
		spyOn(scene2, "render");
		spyOn(scene3, "render");

		subject.render({});

		expect(scene1.render).not.toHaveBeenCalled();
		expect(scene2.render).toHaveBeenCalled();
		expect(scene3.render).toHaveBeenCalled();
	});
});
