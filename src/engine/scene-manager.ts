import Engine from "./engine";
import { Rectangle } from "src/util";
import { Renderer } from "./rendering";
import Scene from "./scenes/scene";

class SceneManager {
	public engine: Engine = null;
	private _stack: Scene[] = [];
	private _determineBounds: () => Rectangle;
	private _popHandlers = new Map<Scene, () => void>();
	private _currentScene: Scene;

	constructor(determineBounds: () => Rectangle) {
		this._determineBounds = determineBounds;
	}

	pushScene(scene: Scene): void {
		scene.engine = this.engine;

		this._stack.push(scene);
		this.currentScene = scene;
	}

	async update(ticks: number): Promise<void> {
		await this.currentScene.update(ticks);
	}

	render(renderer: Renderer): void {
		// TODO: determine visible scenes at push/pop time
		let visibleScenes: Scene[] = [];
		for (let i = 0, len = this._stack.length; i < len; i++) {
			const scene = this._stack[i];
			if (scene.isOpaque()) visibleScenes = [scene];
			else visibleScenes.push(scene);
		}

		for (let i = 0, len = visibleScenes.length; i < len; i++) visibleScenes[i].render(renderer);
	}

	popScene() {
		const oldScene = this._stack.pop();
		const nextScene = this._stack.last();

		if (this._popHandlers.has(oldScene)) {
			this._popHandlers.get(oldScene)();
		}

		if (nextScene !== this._stack.last()) {
			return oldScene;
		}

		this.currentScene = this._stack.last();

		return oldScene;
	}

	async presentScene(scene: Scene): Promise<void> {
		return new Promise(resolve => {
			this._popHandlers.set(scene, resolve);
			this.pushScene(scene);
		});
	}

	clear() {
		while (this._stack.length) this.popScene();
	}

	get bounds() {
		return this._determineBounds();
	}

	public get currentScene() {
		return this._currentScene;
	}

	public set currentScene(newScene: Scene) {
		const oldScene = this._currentScene;
		if (oldScene) oldScene.willHide();
		if (newScene) newScene.willShow();

		this._currentScene = newScene;
		this._popHandlers.delete(oldScene);

		if (newScene) newScene.didShow();
		if (oldScene) oldScene.didHide();
	}
}

export default SceneManager;
