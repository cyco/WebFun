import SceneManager from '/engine/scene-manager';
import { Scene } from '/engine/scenes';

describe("SceneManager", () => {
	let subject;
	beforeEach(() => {
		subject = new SceneManager();
	});

	it('is in charge of managing the stack of scenes visible during gameplay', () => {
		const scene1 = new(class extends Scene {})();
		const scene2 = new(class extends Scene {})();

		subject.pushScene(scene1);
		subject.pushScene(scene2);

		expect(subject.currentScene).toBe(scene2);

		subject.popScene();
		expect(subject.currentScene).toBe(scene1);
	});
});
