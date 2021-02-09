import RendererInterface from "../rendering/renderer";
import { Point } from "src/util";
import Scene from "./scene";
import { Tile } from "src/engine/objects";
import { Yoda } from "src/engine/variant";
import { drawTileImageData } from "src/app/webfun/rendering";
import { abs } from "src/std/math";

class DetonatorScene extends Scene {
	private _detonatorFrames: HTMLImageElement[] = null;
	private _ticks: number = -1;
	public detonatorLocation: Point = null;

	public willShow(): void {
		this._ticks = 0;
		this.cacheDetonatorFrames();
	}

	public willHide(): void {
		this._ticks = -1;
		this.detonatorLocation = null;
	}

	async update(/*ticks*/): Promise<void> {
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

				zone.monsters
					.filter(({ enabled }) => enabled)
					.filter(({ position }) => position.isEqualTo(target))
					.map(npc => {
						npc.damageTaken += damage;
						return npc;
					})
					.filter(({ alive }) => !alive)
					.forEach(npc => {
						zone.setTile(null, npc.position);
						npc.enabled = false;
					});
			}
		}
	}

	public render(renderer: RendererInterface): void {
		if (this._ticks >= this._detonatorFrames.length || this._ticks < 0) return;

		const frame = this._detonatorFrames[this._ticks];
		const p = this.cameraOffset.byAdding(this.detonatorLocation).byScalingBy(Tile.WIDTH);
		renderer.renderImage(frame, p.x, p.y);
	}

	private cacheDetonatorFrames() {
		if (!this.engine) {
			return;
		}

		if (this._detonatorFrames) {
			return;
		}

		this._detonatorFrames = [];
		for (const id of Yoda.animations.ThermalDetonatorAnimation) {
			drawTileImageData(this.engine.assets.get(Tile, id), this.engine.palette.original)
				.toImage()
				.then(i => this._detonatorFrames.push(i));
		}
	}
}

export default DetonatorScene;
