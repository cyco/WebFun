import AbstractRenderer from "../rendering/abstract-renderer";
import Engine from "../engine";
import { Point } from "src/util";
import { Renderer } from "src/app/rendering/canvas";
import Scene from "./scene";
import { Tile } from "src/engine/objects";
import { Yoda } from "src/engine";
import { drawTileImageData } from "src/app/rendering";

class DetonatorScene extends Scene {
	private _detonatorFrames: HTMLImageElement[] = [];
	private _ticks: number = -1;
	public detonatorLocation: Point = null;
	private _engine: Engine = null;

	public willShow() {
		this.engine.inventory.removeItem(Yoda.ItemIDs.ThermalDetonator);
		this._ticks = 0;
	}

	public willHide() {
		this._ticks = -1;
		this.detonatorLocation = null;
	}

	async update(/*ticks*/) {
		if (this._ticks === -1) return;

		this._ticks++;
		if (this._ticks >= this._detonatorFrames.length) {
			// TODO: damage enemeis
			this._ticks = -1;
			this.engine.sceneManager.popScene();
		}
	}

	public render(r: AbstractRenderer) {
		const renderer = r as Renderer;
		for (let i = 0; i <= this._ticks && i < this._detonatorFrames.length; i++) {
			const frame = this._detonatorFrames[i];
			const p = this.cameraOffset.byAdding(this.detonatorLocation).byScalingBy(Tile.WIDTH);
			renderer.renderImage(frame, p.x, p.y);
		}
	}

	public set engine(e: Engine) {
		if (this._engine) {
			this._detonatorFrames = [];
		}

		this._engine = e;

		if (this._engine) {
			this._detonatorFrames = [];
			for (const id of Yoda.Animation.Detonator) {
				drawTileImageData(e.data.tiles[id], e.palette.original)
					.toImage()
					.then(i => this._detonatorFrames.push(i));
			}
		}
	}

	public get engine() {
		return this._engine;
	}
}

export default DetonatorScene;
