import "./sector-preview.scss";
import { ColorPalette } from "src/engine";
import { Component } from "src/ui";
import Sector from "src/engine/sector";
import ZoneView from "./zone-view";
import { TileView } from "src/debug/components";
import { Tile } from "src/engine/objects";

class SectorPreview extends Component {
	public static readonly tagName = "wf-save-game-editor-sector-preview";

	private _sector: Sector;
	private _zonePreview: ZoneView = (<ZoneView />) as ZoneView;
	private _sectorDetails: HTMLElement = (<div />);

	connectedCallback() {
		super.connectedCallback();
		this.appendChild(this._zonePreview);
		this.appendChild(this._sectorDetails);
	}

	disconnectedCallback() {
		this.removeChild(this._sectorDetails);
		this.removeChild(this._zonePreview);
		super.disconnectedCallback();
	}

	public get sector() {
		return this._sector;
	}

	public set sector(s: Sector) {
		this._sector = s;
		this._zonePreview.zone = this._sector.zone;

		this._rebuildDetails();
	}

	private _rebuildDetails() {
		const { palette } = this;
		const {
			findItem,
			requiredItem,
			additionalRequiredItem,
			solved1,
			solved2,
			solved3,
			solved4,
			zone
		} = this._sector;

		const tileRow = (label: string, tile: Tile, tile2?: Tile) =>
			tile ? (
				<div>
					<div>{label}</div>
					<div>
						<TileView tile={tile} palette={palette} />
						<TileView tile={tile2} palette={palette} />
					</div>
				</div>
			) : null;

		const oldDetails = this._sectorDetails;
		this._sectorDetails = (
			<div className="sector-details">
				<div className="sector-solved">
					<span>{solved1 ? "YES" : "NO"}</span>
					<span>{solved2 ? "YES" : "NO"}</span>
					<span>{solved3 ? "YES" : "NO"}</span>
					<span>{solved4 ? "YES" : "NO"}</span>
				</div>
				{tileRow("Find", findItem)}
				{tileRow("Use", requiredItem, additionalRequiredItem)}

				<div className="sector-solved">
					<span>{`${zone.type.name}`}</span>
					<span>{`ctr ${zone.counter}`}</span>
					<span>{`rnd ${zone.random}`}</span>
					<span>{`sctr ${zone.sharedCounter}`}</span>
				</div>
			</div>
		);
		if (this.isConnected) this.replaceChild(this._sectorDetails, oldDetails);
	}

	public set palette(p: ColorPalette) {
		this._zonePreview.palette = p;
	}

	public get palette() {
		return this._zonePreview.palette;
	}
}

export default SectorPreview;
