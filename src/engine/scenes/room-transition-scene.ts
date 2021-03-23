import Scene from "./scene";
import World from "../world";
import ZoneScene from "./zone-scene";
import { EvaluationMode, ScriptResult } from "../script";
import { Point } from "src/util";
import { Renderer } from "../rendering";
import { Tile, Zone } from "../objects";
import { floor } from "src/std/math";
import Settings from "src/settings";

const enum FadeMode {
	FadeIn = -1,
	FadeOut = 1
}
const TotalFadeDuration = 1500.0;
const ViewportWidth = 9.0;
const ViewportHeight = 9.0;

class RoomTransitionScene extends Scene {
	public scene: ZoneScene = null;
	public destinationHeroLocation: Point = null;
	public destinationSector: Point = null;
	public originSector: Point = null;
	public destinationZone: Zone = null;
	public destinationWorld: World = null;
	public originZone: Zone = null;

	private duration = TotalFadeDuration / 2.0;
	private _startTime: number = Infinity;
	private _mode: FadeMode = FadeMode.FadeOut;
	private _executingActions: boolean;
	private _sequence: AsyncGenerator<void>;
	private _aborted = false;
	private _skipped = false;

	public willShow(): void {
		if (this._executingActions) return;
		this.engine.spu.drain();
		this._sequence = this.buildSequence();
		this._startTime = performance.now();
		this.originZone = this.engine.currentZone;
	}

	public didHide(): void {
		if (this._executingActions) return;

		this.scene = null;
		this._sequence = null;
		this.destinationHeroLocation = null;
		this.destinationSector = null;
		this.originSector = null;
		this.destinationZone = null;
		this.destinationWorld = null;
		this.originZone = null;
	}

	async update(/*ticks*/): Promise<void> {
		if (this._aborted) return;
		this._executingActions = true;

		if (this._skipped) {
			if (this._mode !== FadeMode.FadeIn) {
				this._startTime = performance.now();
				this._mode = FadeMode.FadeIn;
				this.engine.triggerLocationChange();
			}
			if (!this.isFadeComplete()) return;
		}

		const result = await this.engine.spu.run();
		if (result !== ScriptResult.Done) {
			if (result === ScriptResult.UpdateZone) {
				this.engine.spu.drain();
				this._aborted = true;
				this.didHide();
			}
			this._skipped = true;
			return;
		}
		this._executingActions = false;
		if (this._aborted) return;

		await this._sequence.next();
	}

	render(renderer: Renderer): void {
		const ellapsedTime = performance.now() - this._startTime;
		const animationProgress = this._mode * (ellapsedTime / this.duration);

		let blackTiles = floor(animationProgress * 6);
		if (this._mode === FadeMode.FadeIn) blackTiles = 6 + blackTiles;

		renderer.fillBlackRect(0, 0, ViewportWidth * Tile.WIDTH, blackTiles * Tile.HEIGHT);
		renderer.fillBlackRect(0, 0, blackTiles * Tile.WIDTH, ViewportHeight * Tile.HEIGHT);
		renderer.fillBlackRect(
			(ViewportWidth - blackTiles) * Tile.WIDTH,
			0,
			blackTiles * Tile.WIDTH,
			ViewportHeight * Tile.HEIGHT
		);
		renderer.fillBlackRect(
			0,
			(ViewportHeight - blackTiles) * Tile.HEIGHT,
			ViewportHeight * Tile.WIDTH,
			blackTiles * Tile.HEIGHT
		);
	}

	private async *buildSequence(): AsyncGenerator<void> {
		const { scene, engine, destinationZone, destinationWorld, destinationHeroLocation } = this;

		while (!this.isFadeComplete()) yield;

		engine.hero.location = destinationHeroLocation;
		engine.currentWorld = destinationWorld;
		engine.currentZone = destinationZone;
		scene.zone = engine.currentZone;
		engine.camera.hero = engine.hero;
		engine.camera.zoneSize = engine.currentZone.size;
		engine.camera.update(Infinity);

		this.destinationZone.sectorCounter = this.originZone.sectorCounter;

		engine.spu.prepareExecution(EvaluationMode.JustEntered, destinationZone);
		yield;

		const mode = destinationZone.visited
			? EvaluationMode.ByPlane
			: EvaluationMode.Initialize | EvaluationMode.ByPlane;
		engine.spu.prepareExecution(mode, destinationZone);
		yield;

		if (!destinationZone.visited) {
			destinationZone.visited = true;
			destinationZone.initialize();
		}

		if (this._mode !== FadeMode.FadeIn) {
			this._startTime = performance.now();
			this._mode = FadeMode.FadeIn;
			this.engine.triggerLocationChange();
		}

		while (!this.isFadeComplete()) yield;

		engine.spu.prepareExecution(EvaluationMode.ByPlane, destinationZone);
		engine.sceneManager.popScene();
	}

	private isFadeComplete() {
		if (Settings.skipTransitions) return true;

		return this.duration < performance.now() - this._startTime;
	}

	public isOpaque(): boolean {
		return false;
	}
}

export default RoomTransitionScene;
