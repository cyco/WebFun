export default class SceneManager {
	constructor() {
		this._stack = [];
		this.engine = null;
	}

	pushScene(scene) {
		let currentScene = this.currentScene;

		scene.engine = this.engine;

		scene.willShow();
		if (currentScene) currentScene.willHide();
		this._stack.push(scene);
		if (currentScene) currentScene.didHide();
		scene.didShow();
	}

	update(ticks) {
		this.currentScene.update(ticks);
	}

	render(renderer) {
		// TODO: determine visible scenes at push/pop time
		let visibleScenes = [];
		for (let i = 0, len = this._stack.length; i < len; i++) {
			const scene = this._stack[i];
			if (scene.isOpaque())
				visibleScenes = [scene];
			else visibleScenes.push(scene);
		}

		for (let i = 0, len = visibleScenes.length; i < len; i++)
			visibleScenes[i].render(renderer);
	}

	popScene() {
		const oldScene = this.currentScene;
		const newScene = this._stack[this._stack.length - 2];
		if (oldScene) oldScene.willHide();
		if (newScene) newScene.willShow();

		const scene = this._stack.pop();

		if (newScene) newScene.didShow();
		if (oldScene) oldScene.didHide();

		return scene;
	}

	clear() {
		while (this.popScene());
	}

	get currentScene() {
		return this._stack.last();
	}
}
