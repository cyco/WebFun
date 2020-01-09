import { Scene } from "src/engine";
import { Renderer } from "src/engine/rendering";
import { Point, rgba } from "src/util";
import { ZoneScene } from "src/engine/scenes";
import { CanvasRenderer } from "src/app/rendering";
import { Tile } from "src/engine/objects";

class PathUIScene extends Scene {
	public highlight: Point;
	public target: Point;
	private offset = 0;

	public render(renderer: Renderer): void {
		if (!this.highlight && !this.target) return;
		if (!this.engine) return;
		if (!this.engine.sceneManager) return;
		if (!(this.engine.sceneManager.currentScene instanceof ZoneScene)) return;
		if (!(renderer instanceof CanvasRenderer.Renderer)) return;
		if (!this.engine.hero.visible) return;

		if (this.highlight) {
			const walkable = this.walkable;
			this.highlightTile(
				renderer,
				this.highlight.byScalingBy(9).floor(),
				walkable ? rgba(0, 255, 0, 0.5) : rgba(255, 0, 0, 0.5),
				walkable ? this.offset : 0
			);
		}

		if (this.target) {
			this.highlightTile(
				renderer,
				this.target.byAdding(this.cameraOffset),
				rgba(255, 255, 255, 0.8),
				this.offset
			);
		}
	}

	public async update(_: number): Promise<void> {
		this.offset--;
	}

	private highlightTile(renderer: CanvasRenderer.Renderer, tile: Point, color: string, offset: number) {
		const ctx = renderer.context;

		ctx.save();
		ctx.globalCompositeOperation = "source-over";
		ctx.lineWidth = 2;
		ctx.strokeStyle = color;
		ctx.setLineDash([5]);
		ctx.lineDashOffset = offset;

		ctx.strokeRect(tile.x * Tile.WIDTH, tile.y * Tile.HEIGHT, Tile.WIDTH, Tile.HEIGHT);
		ctx.restore();
	}

	public get walkable() {
		const scene = this.engine.sceneManager.currentScene;
		if (!(scene instanceof ZoneScene)) return false;

		return scene.zone.placeWalkable(
			this.highlight
				.byScalingBy(9)
				.floor()
				.subtract(this.cameraOffset)
		);
	}
}

export default PathUIScene;
