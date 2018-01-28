import Engine from "./engine";
import { Renderer } from "./rendering";
import Scene from "./scenes/scene";

class SceneManager {
	public engine: Engine = null;
	private _stack: Scene[] = [];
	private _ticking: boolean = false;

	get currentScene() {
		return this._stack.last();
	}

	pushScene(scene: Scene): void {
		let currentScene = this.currentScene;

		scene.engine = this.engine;

		scene.willShow();
		if (currentScene) currentScene.willHide();
		this._stack.push(scene);
		if (currentScene) currentScene.didHide();
		scene.didShow();
	}

	async update(ticks: number): Promise<void> {
		try {
			await this.currentScene.update(ticks);
		} catch (e) {
			console.error(e);
		}
	}

	render(renderer: Renderer): void {
		// TODO: determine visible scenes at push/pop time
		try {
			let visibleScenes: Scene[] = [];
			for (let i = 0, len = this._stack.length; i < len; i++) {
				const scene = this._stack[i];
				if (scene.isOpaque()) visibleScenes = [scene];
				else visibleScenes.push(scene);
			}

			for (let i = 0, len = visibleScenes.length; i < len; i++) visibleScenes[i].render(renderer);
		} catch (e) {
			console.error(e);
		}
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
}

export default SceneManager;
