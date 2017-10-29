import Component from "src/ui/component";
import { default as Zone } from "src/engine/objects/zone";
import Tile from "src/engine/objects/tile";

class ZoneLayer extends Component {
	public static readonly TagName = "wf-zone-layer";
	public static readonly observedAttributes: string[] = [];
	private _zone: Zone;
	private _layer: number;
	private _canvas = <HTMLCanvasElement>document.createElement("canvas");

	connectedCallback() {
		this.appendChild(this._canvas);
	}

	set zone(zone: Zone) {
		this._zone = zone;

		this._canvas.width = zone.size.width;
		this._canvas.height = zone.size.height;
		this._canvas.style.width = zone.size.width * Tile.WIDTH + "px";
		this._canvas.style.height = zone.size.height * Tile.HEIGHT + "px";

		if (zone.size.width === 9) {
			this._canvas.style.margin = 9 * Tile.WIDTH + "px";
		} else {
			this._canvas.style.margin = "0px";
		}
	}

	get zone() {
		return this._zone;
	}

	set layer(zoneLayer: number) {
		this._layer = zoneLayer;
	}

	get layer() {
		return this._layer;
	}
}

export default ZoneLayer;
