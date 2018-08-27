import Component from "src/ui/component";
import { Zone, Tile, Char } from "src/engine/objects";
import { ColorPalette } from "src/engine/rendering";
import { Point } from "src/util";
import { MenuItemInit } from "src/ui";
import NPCLayerNPC from "./npc-layer-npc";
import "./npc-layer.scss";

class NPCLayer extends Component {
	public static readonly tagName = "wf-npc-layer";
	public static readonly observedAttributes: string[] = [];
	public palette: ColorPalette;
	private _zone: Zone;

	protected connectedCallback() {
		this.draw();
	}

	public update(_: Point[]) {
		this.draw();
	}

	private draw(): void {
		if (!this._zone) return;

		this.textContent = "";
		this._zone.npcs
			.groupedBy(npc => npc.position)
			.forEach(({ length, 0: { face, position: { x, y } } }) =>
				this.appendChild(this.buildNode(new Point(x, y), length, length === 1 ? face : null))
			);
	}

	private buildNode(point: Point, count: number, face: Char) {
		return (
			<NPCLayerNPC
				className="wf-npc-layer-npc"
				style={
					{
						left: `${point.x * Tile.WIDTH - 1}px`,
						top: `${point.y * Tile.HEIGHT - 1}px`
					} as CSSStyleDeclaration
				}
				character={face}
				palette={this.palette}
			>
				{" "}
				{count > 1 ? `${count}` : ""}{" "}
			</NPCLayerNPC>
		);
	}

	set zone(zone: Zone) {
		this._zone = zone;

		this.style.width = zone.size.width * Tile.WIDTH + "px";
		this.style.height = zone.size.height * Tile.HEIGHT + "px";

		if (this.isConnected) this.draw();
	}

	get zone() {
		return this._zone;
	}

	public getMenuForTile(_: Point): Partial<MenuItemInit>[] {
		return [];
	}
}

export default NPCLayer;
