import RendererInterface from "../rendering/renderer";
import Engine from "../engine";
import { Point } from "src/util";
import Scene from "./scene";
import { Tile } from "src/engine/objects";
import { Yoda } from "src/engine";
import { drawTileImageData } from "src/app/rendering";
import { abs } from "src/std/math";

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
			this._dealDamage();

			this._ticks = -1;
			this.engine.sceneManager.popScene();
		}
	}

	private _dealDamage() {
		const zone = this.engine.currentZone;
		const bounds = zone.bounds;
		for (let y = -1; y <= 1; y++) {
			for (let x = -1; x <= 1; x++) {
				const damage = 10 - abs(x) * 2 - abs(y) * 2;
				const target = this.detonatorLocation.byAdding(x, y);
				if (!bounds.contains(target)) continue;

				zone.npcs
					.filter(({ position }) => position.isEqualTo(target))
					.map(npc => ((npc.damageTaken += damage), npc))
					.filter(({ alive }) => !alive)
					.forEach(npc => {
						zone.setTile(null, npc.position);
						npc.enabled = false;
					});
			}
		}
	}

	public render(renderer: RendererInterface) {
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
