import { max, min } from "src/std/math";
import { Tile, Zone } from "../objects";
import { drawZoneImageData } from "src/app/webfun/rendering";
import { Renderer } from "../rendering";
import { Point } from "src/util";
import Scene from "./scene";
import ZoneScene from "./zone-scene";
import World from "../world";
import { EvaluationMode, ScriptResult } from "../script";

const ViewportWidth = 9.0;
const ViewportHeight = 9.0;
const TotalFadeDuration = 1000.0;
const HeroPush = 0.87;

class SectorTransitionScene extends Scene {
	public scene: ZoneScene = null;
	public destinationHeroLocation: Point = null;
	public destinationSector: Point = null;
	public originSector: Point = null;
	public destinationZone: Zone = null;
	public destinationWorld: World = null;
	private _originZone: Zone = null;
	private _startTime: number = -Infinity;
	private duration: number = Infinity;
	private _direction: Point;
	private _originImage: ImageData;
	private _destinationImage: ImageData;
	private _executingActions: boolean = false;
	private _sequence: AsyncGenerator<void>;
	private _originLocation: Point;

	public willShow(): void {
		if (this._executingActions) return;
		this.duration = this.engine.settings.skipTransitions ? 0 : TotalFadeDuration;
		this._direction = this.originSector.bySubtracting(this.destinationSector);
		this._sequence = this.buildSequence();
		this._startTime = Infinity;
		this._originZone = this.engine.currentZone;
		this._originLocation = this.engine.hero.location;
	}

	public didHide(): void {
		if (this._executingActions) return;
		this.scene = null;
		this.destinationHeroLocation = null;
		this.destinationSector = null;
		this.originSector = null;
		this.destinationZone = null;
		this.destinationWorld = null;
		this._direction = null;
		this._originImage = null;
		this._destinationImage = null;
		this._originZone = null;
		this._originLocation = null;
	}

	async update(/*ticks*/): Promise<void> {
		this._executingActions = true;
		const result = await this.engine.spu.run();
		if (result !== ScriptResult.Done) {
			return;
		}
		this._executingActions = false;

		await this._sequence.next();
	}

	private async *buildSequence(): AsyncGenerator<void> {
		const { engine, destinationZone, destinationHeroLocation, destinationWorld } = this;
		const hero = this.engine.hero;

		hero.location = destinationHeroLocation;
		engine.currentWorld = destinationWorld;
		engine.currentZone = destinationZone;
		this.scene.zone = destinationZone;

		engine.spu.prepareExecution(EvaluationMode.JustEntered, destinationZone);
		yield;

		if (!destinationZone.visited) {
			engine.spu.prepareExecution(EvaluationMode.Initialize, destinationZone);
			yield;
		}

		if (!destinationZone.visited) {
			destinationZone.visited = true;
			destinationZone.initialize();
		}

		this._destinationImage = null;
		this._originImage = null;
		this._startTime = performance.now();

		// wait for hero to be "pushed" of the old map
		while (max(min((performance.now() - this._startTime) / this.duration, 1), 0) < HeroPush) yield;

		// redraw images
		this._destinationImage = null;
		this._originImage = null;

		while (!this.isFadeComplete()) yield;
		this.engine.triggerLocationChange();

		this.scene.prepareCamera();
		engine.sceneManager.popScene();
	}

	private isFadeComplete() {
		if (this.engine.settings.skipTransitions) return true;

		return this.duration < performance.now() - this._startTime;
	}

	render(renderer: Renderer): void {
		const state = performance.now() - this._startTime;
		this.renderState(renderer, state);
	}

	protected renderState(renderer: Renderer, state: number): void {
		const animationState = max(min(state / this.duration, 1), 0);

		if (!this._originImage) {
			const hero = this.engine.hero;
			const appearance = hero._appearance;
			const frame = hero._actionFrames;
			let tile = animationState < HeroPush ? appearance.getFace(hero._direction, frame) : null;
			this._originImage = drawZoneImageData(
				this._originZone,
				this.engine.palette.current,
				tile,
				this._originLocation
			);

			tile = animationState >= HeroPush ? appearance.getFace(hero._direction, frame) : null;
			this._destinationImage = drawZoneImageData(
				this.destinationZone,
				this.engine.palette.current,
				tile,
				hero.location
			);
		}

		const camera = this.engine.camera;
		const cameraOffset = camera.offset.byScalingBy(Tile.WIDTH);
		const viewportWidth = Tile.WIDTH * ViewportWidth;
		const viewportHeight = Tile.HEIGHT * ViewportHeight;

		renderer.renderImageData(
			this._originImage,
			cameraOffset.x + this._direction.x * viewportWidth * animationState,
			cameraOffset.y + this._direction.y * viewportHeight * animationState
		);
		renderer.renderImageData(
			this._destinationImage,
			cameraOffset.x + this._direction.x * viewportWidth * (animationState - 2),
			cameraOffset.y + this._direction.y * viewportHeight * (animationState - 2)
		);
	}

	public isOpaque(): boolean {
		return false;
	}
}

export default SectorTransitionScene;
