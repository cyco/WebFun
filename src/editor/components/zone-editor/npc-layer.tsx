import Component from "src/ui/component";
import { Zone, Tile, Char } from "src/engine/objects";
import { MutableNPC } from "src/engine/mutable-objects";
import { ColorPalette } from "src/engine/rendering";
import { Point } from "src/util";
import { MenuItemInit, MenuItemSeparator } from "src/ui";
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

	public getMenuForTile(point: Point): Partial<MenuItemInit>[] {
		const npcs = this._findNPCsAt(point);

		return [
			{
				title: "Place NPC",
				callback: (): void => {
					const npc = new MutableNPC();
					npc.position = point;
					this.zone.npcs.push(npc);
					this.draw();
				}
			},
			...npcs
				.map((npc, _) => [
					MenuItemSeparator,
					{
						title: npc.face.name + (npc.enabled ? "" : " (disabled)")
					},
					{
						title: "remove",
						callback: () => {
							this.zone.npcs.splice(this.zone.npcs.indexOf(npcs[0]), 1);
							this.draw();
						}
					}
				])
				.flatten()
		];
	}

	private _findNPCsAt(point: Point) {
		return this.zone.npcs.filter(({ position: { x, y } }) => x === point.x && y === point.y);
	}
}

export default NPCLayer;
