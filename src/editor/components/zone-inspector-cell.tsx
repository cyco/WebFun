import "./zone-inspector-cell.scss";

import { Cell, InlineSelector } from "src/ui/components";
import { Tile, Zone, ZoneType } from "src/engine/objects";

import { ColorPalette } from "src/engine/rendering";
import { Planet } from "src/engine/types";
import { TileView } from "src/debug/components";

const Events = {
	RevealReferences: "RevealReferences",
	RemoveZone: "RemoveZone",
	ChangeType: "ChangeType",
	ChangePlanet: "ChangePlanet"
};

class ZoneInspectorCell extends Cell<Zone> {
	public static readonly Events = Events;
	public static readonly tagName = "wf-zone-inspector-cell";
	public static readonly observedAttributes: string[] = [];

	public palette: ColorPalette;
	public tiles: Tile[];

	protected connectedCallback() {
		const tile = this._tileForType(this.data.type);

		this.appendChild(<TileView palette={this.palette} tile={tile} />);
		this.appendChild(
			<div className="content">
				<span className="id">{this.data.id.toString()}</span>
				<InlineSelector
					className="type"
					onchange={(e: CustomEvent) =>
						this.dispatchEvent(
							new CustomEvent(Events.ChangeType, {
								detail: {
									type: (e.target as InlineSelector<ZoneType>).value,
									zone: this.data
								},
								bubbles: true
							})
						)
					}
					options={[
						Zone.Type.None,
						Zone.Type.Empty,
						Zone.Type.BlockadeNorth,
						Zone.Type.BlockadeSouth,
						Zone.Type.BlockadeEast,
						Zone.Type.BlockadeWest,
						Zone.Type.UnknownIndyOnly,
						Zone.Type.TravelStart,
						Zone.Type.TravelEnd,
						Zone.Type.Room,
						Zone.Type.Load,
						Zone.Type.Goal,
						Zone.Type.Town,
						Zone.Type.Win,
						Zone.Type.Lose,
						Zone.Type.Trade,
						Zone.Type.Use,
						Zone.Type.Find,
						Zone.Type.FindTheForce,

						Zone.Type.Unknown
					].map(t => ({
						value: t,
						label: t === Zone.Type.Empty && this.data.hasTeleporter ? "Teleporter" : t.name
					}))}
					value={this.data.type}
				/>
				<InlineSelector
					className="planet"
					onchange={(e: CustomEvent) =>
						this.dispatchEvent(
							new CustomEvent(Events.ChangePlanet, {
								detail: {
									planet: (e.target as InlineSelector<Planet>).value,
									zone: this.data
								},
								bubbles: true
							})
						)
					}
					options={[
						{ label: "None", value: Planet.NONE },
						{ label: "Tatooine", value: Planet.TATOOINE },
						{ label: "Endor", value: Planet.ENDOR },
						{ label: "Hoth", value: Planet.HOTH },
						{ label: "Dagobah", value: Planet.DAGOBAH }
					]}
					value={this.data.planet}
				/>
				<span>
					<i
						className="fa fa-search"
						onclick={e => {
							this.dispatchEvent(
								new CustomEvent(Events.RevealReferences, {
									detail: { zone: this.data },
									bubbles: true
								})
							);
							e.stopPropagation();
						}}
					/>
					<i
						className="fa fa-remove"
						onclick={(e: Event) => {
							this.dispatchEvent(
								new CustomEvent(Events.RemoveZone, {
									detail: { zone: this.data },
									bubbles: true
								})
							);
							e.stopPropagation();
						}}
					/>
				</span>
				<span className="size">
					{this.data.size.width}x{this.data.size.height}
				</span>
			</div>
		);
	}

	private _tileForType(zoneType: ZoneType): Tile {
		const tileId = this.tileIdForZoneType(zoneType);
		if (tileId === -1) return null;

		return this.tiles[tileId];
	}

	private tileIdForZoneType(zoneType: ZoneType) {
		switch (zoneType) {
			case ZoneType.Town:
				return 829;
			case ZoneType.Goal:
				return 830;
			case ZoneType.BlockadeWest:
				return 827;
			case ZoneType.BlockadeEast:
				return 823;
			case ZoneType.BlockadeNorth:
				return 821;
			case ZoneType.BlockadeSouth:
				return 825;
			case ZoneType.Find:
			case ZoneType.FindTheForce:
			case ZoneType.Trade:
			case ZoneType.Use:
				return 818;
			case ZoneType.TravelStart:
			case ZoneType.TravelEnd:
				return 820;
			case ZoneType.Empty:
				if (this.data.hasTeleporter) return 834;
				return 832;
			case ZoneType.Room:
				return 835;
			case ZoneType.None:
			case ZoneType.Load:
			case ZoneType.Unknown:
				return 836;
		}
		return -1;
	}

	public cloneNode(deep?: boolean): ZoneInspectorCell {
		const node = super.cloneNode(deep) as ZoneInspectorCell;
		node.palette = this.palette;
		node.tiles = this.tiles;
		node.onclick = this.onclick;
		node.oncontextmenu = this.oncontextmenu;
		return node;
	}

	protected disconnectedCallback() {
		this.textContent = "";
	}
}

export default ZoneInspectorCell;
