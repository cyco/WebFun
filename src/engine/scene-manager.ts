import { Rectangle, EventTarget } from "src/util";
import { Renderer } from "./rendering";
import Engine from "./engine";
import Scene from "./scenes/scene";

export const Event = {
	SceneChanged: "scenechange"
};

class SceneManager extends EventTarget {
	public static readonly Event = Event;
	private _engine: Engine = null;
	private _stack: Scene[] = [];
	private _determineBounds: () => Rectangle;
	private _popHandlers = new Map<Scene, () => void>();
	private _currentScene: Scene;
	private _overlays: Scene[] = [];
	private _visibleScenes: Scene[] = [];

	constructor(determineBounds: () => Rectangle) {
		super();
		this._determineBounds = determineBounds;
	}

	pushScene(scene: Scene): void {
		scene.engine = this.engine;
		this._stack.push(scene);
		this._rebuildVisibleScenes();
		this.currentScene = scene;
	}

	async update(ticks: number): Promise<void> {
		await this.currentScene.update(ticks);
		for (let i = 0, len = this._overlays.length; i < len; i++) {
			this._overlays[i].update(ticks);
		}
	}

	render(renderer: Renderer): void {
		for (let i = 0, len = this._visibleScenes.length; i < len; i++) {
			this._visibleScenes[i].render(renderer);
		}

		for (let i = 0, len = this._overlays.length; i < len; i++) {
			this._overlays[i].render(renderer);
		}
	}

	popScene(): Scene {
		const oldScene = this._stack.pop();
		const nextScene = this._stack.last();

		if (this._popHandlers.has(oldScene)) {
			this._popHandlers.get(oldScene)();
		}

		this._rebuildVisibleScenes();

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

	clear(): void {
		while (this._stack.length) this.popScene();
	}

	get bounds(): Rectangle {
		return this._determineBounds();
	}

	public get currentScene(): Scene {
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

		this.dispatchEvent(new CustomEvent(Event.SceneChanged));
	}

	private _rebuildVisibleScenes() {
		let visibleScenes: Scene[] = [];
		for (let i = 0, len = this._stack.length; i < len; i++) {
			const scene = this._stack[i];
			if (scene.isOpaque()) visibleScenes = [scene];
			else visibleScenes.push(scene);
		}
		this._visibleScenes = visibleScenes;
	}

	public addOverlay(overlay: Scene): void {
		this._overlays.push(overlay);
		overlay.engine = this.engine;
	}

	public removeOverlay(overlay: Scene): void {
		overlay.engine = null;
		this._overlays.splice(this._overlays.indexOf(overlay), 1);
	}

	public get engine(): Engine {
		return this._engine;
	}

	public set engine(e: Engine) {
		this._engine = e;
		this._stack.forEach(s => (s.engine = e));
		this._overlays.forEach(o => (o.engine = e));
	}
}

export default SceneManager;
