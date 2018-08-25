import Component from "src/ui/component";
import { Zone, Tile, Hotspot } from "src/engine/objects";
import { MutableHotspot, MutableZone } from "src/engine/mutable-objects";
import { ColorPalette } from "src/engine/rendering";
import { Point } from "src/util";
import { MenuItemInit, MenuItemSeparator } from "src/ui";
import { ModalPrompt } from "src/ux";
import "./hotspot-layer.scss";

class HotspotLayer extends Component {
	public static readonly tagName = "wf-hotspot-layer";
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
		this._zone.hotspots
			.groupedBy(htsp => htsp.location)
			.forEach(({ length, 0: { x, y } }) =>
				this.appendChild(this.buildNode(new Point(x, y), length))
			);
	}

	private buildNode(point: Point, count: number) {
		return (
			<div
				className="wf-hotspot-layer-hotspot"
				style={
					{
						left: `${point.x * Tile.WIDTH}px`,
						top: `${point.y * Tile.HEIGHT}px`
					} as CSSStyleDeclaration
				}
			>
				{count > 1 ? `${count}` : ""}
			</div>
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
		const hotspots = this._findHotspotsAt(point);

		return [
			{
				title: "Place hotspot",
				callback: (): void => {
					const hotspot = new MutableHotspot();
					hotspot.type = MutableHotspot.Type.TriggerLocation;
					hotspot.arg = -1;
					hotspot.x = point.x;
					hotspot.y = point.y;

					this.zone.hotspots.push(hotspot);
					this.draw();
				}
			},
			...hotspots
				.map((htsp, i) => [
					MenuItemSeparator,
					{
						title: htsp.type.name + (htsp.enabled ? "" : " (disabled)")
					},
					{
						title: `${htsp.x}x${htsp.y}`
					},
					{
						title: htsp.arg.toHex(2)
					},
					{
						title: () => (htsp.enabled ? "Disable" : "Enable"),
						callback: () => {
							htsp.enabled = !htsp.enabled;
							this.draw();
						}
					},
					{
						title: "change type",
						callback: async () => {
							const raw = await ModalPrompt("Pick new type", {
								defaultValue: `${htsp.type.rawValue}`,
								options: Hotspot.Type.knownTypes.map(type => ({
									value: `${type.rawValue}`,
									label: type.name
								}))
							});
							if (raw === null) return;

							htsp.type = Hotspot.Type.fromNumber(+raw);
						}
					},
					{
						title: "remove",
						callback: () => {
							this.zone.hotspots.splice(this.zone.hotspots.indexOf(hotspots[0]), 1);
							this.draw();
						}
					}
				])
				.flatten()
		];
	}

	private _groupedHotspots(hotspots: Hotspot[]): Hotspot[][] {
		return hotspots.groupedBy(htsp => htsp.location);
	}

	private _findHotspotsAt(point: Point) {
		return this.zone.hotspots.filter(({ x, y }) => x === point.x && y === point.y);
	}
}

export default HotspotLayer;
