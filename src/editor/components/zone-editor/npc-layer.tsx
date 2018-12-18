import Component from "src/ui/component";
import { Zone, Tile, Char } from "src/engine/objects";
import { MutableNPC } from "src/engine/mutable-objects";
import { CompressedColorPalette } from "src/engine/rendering";
import { Point } from "src/util";
import { MenuItemInit, MenuItemSeparator } from "src/ui";
import { ModalPrompt } from "src/ux";
import NPCLayerNPC from "./npc-layer-npc";
import "./npc-layer.scss";

class NPCLayer extends Component {
	public static readonly tagName = "wf-npc-layer";
	public static readonly observedAttributes: string[] = [];
	public palette: CompressedColorPalette;
	public characters: Char[];
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
		const npcs = this._findNPCsAt(point) as MutableNPC[];

		return [
			{
				title: "Place NPC",
				callback: (): void => {
					const npc = new MutableNPC();
					npc.character = this.enemies.first();
					npc.position = point;
					npc.unknown1 = 0;
					npc.unknown2 = 0;
					npc.data = new Int8Array(Array.Repeat(-1, 32));
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
						title: "Change Type",
						callback: async () => {
							const t = await ModalPrompt("Pick enemy type:", {
								defaultValue: npc.face.id.toString(),
								options: this.enemies.map(e => ({
									label: e.name,
									value: e.id.toString()
								}))
							});
							if (!t) return;
							npc.character = this.enemies.find(e => e.id === +t);
							this.draw();
						}
					},
					{
						title: () => (npc.enabled ? "Disable" : "Enable"),
						callback: (): void => void (npc.enabled = !npc.enabled)
					},
					{
						title: "Remove",
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

	private get enemies() {
		return this.characters.withType(Char.Type.Enemy);
	}
}

export default NPCLayer;
