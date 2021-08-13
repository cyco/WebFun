import "./hotspot-layer.scss";

import { Hotspot, Tile, Zone } from "src/engine/objects";
import { MenuItemInit, MenuItemSeparator } from "src/ui";

import { ColorPalette } from "src/engine/rendering";
import Component from "src/ui/component";
import { ModalPrompt } from "src/ux";
import { Point } from "src/util";
import { Updater } from "../../reference";
import ServiceContainer from "../../service-container";

class HotspotLayer extends Component {
	public static readonly tagName = "wf-hotspot-layer";
	public static readonly observedAttributes: string[] = [];
	public palette: ColorPalette;
	public di: ServiceContainer;
	private updater: Updater;
	private _zone: Zone;

	protected connectedCallback(): void {
		this.updater = this.di.get(Updater);

		this.draw();
	}

	public update(_: Point[]): void {
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
				style={{
					left: `${point.x * Tile.WIDTH}px`,
					top: `${point.y * Tile.HEIGHT}px`
				}}>
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

	get zone(): Zone {
		return this._zone;
	}

	public getMenuForTile(point: Point): Partial<MenuItemInit>[] {
		const hotspots = this._findHotspotsAt(point);

		return [
			{
				title: "Place hotspot",
				callback: (): void => {
					const hotspot = new Hotspot(this.zone.hotspots.length, {
						type: Hotspot.Type.DropQuestItem.rawValue,
						argument: -1,
						x: point.x,
						y: point.y,
						enabled: true
					});

					this.zone.hotspots.push(hotspot);
					this.draw();
				}
			},
			...hotspots
				.map(htsp => [
					MenuItemSeparator,
					{
						title: `${htsp.id.toString()}: ` + htsp.type.name + (htsp.enabled ? "" : " (disabled)")
					},
					{
						title: `${htsp.x}x${htsp.y}`
					},
					{
						title: htsp.argument.toHex(2)
					},
					{
						title: () => (htsp.enabled ? "Disable" : "Enable"),
						callback: () => {
							htsp.enabled = !htsp.enabled;
							this.draw();
						}
					},
					{
						title: "Change Argument",
						callback: async () => {
							const raw = await ModalPrompt("Set new argument", {
								defaultValue: htsp.argument.toHex(2)
							});
							if (raw === null) return;
							htsp.argument = +raw;
						}
					},
					{
						title: "Change Type",
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
							this.updater.deleteItem(hotspots[0]);
							this.draw();
						}
					}
				])
				.flatten()
		];
	}

	private _findHotspotsAt(point: Point) {
		return this.zone.hotspots.filter(({ x, y }) => x === point.x && y === point.y);
	}
}

export default HotspotLayer;
