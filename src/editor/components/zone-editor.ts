import Component from "src/ui/component";
import ZoneLayer from "src/editor/components/zone-layer";
import "./zone-editor.scss";
import { Zone } from "src/engine/objects";
import TileSheet from "src/editor/tile-sheet";

class ZoneEditor extends Component {
	public static readonly TagName = "wf-zone-editor";
	public static readonly observedAttributes: string[] = [];
	private _zone: Zone;
	private _floor: ZoneLayer;
	private _objects: ZoneLayer;
	private _roof: ZoneLayer;
	private _tileSheet: TileSheet;

	constructor() {
		super();

		this._floor = <ZoneLayer>document.createElement(ZoneLayer.TagName);
		this._floor.layer = Zone.Layer.Floor;
		this._objects = <ZoneLayer>document.createElement(ZoneLayer.TagName);
		this._objects.layer = Zone.Layer.Object;
		this._roof = <ZoneLayer>document.createElement(ZoneLayer.TagName);
		this._roof.layer = Zone.Layer.Roof;
	}

	connectedCallback() {
		this.appendChild(this._floor);
		this.appendChild(this._objects);
		this.appendChild(this._roof);
	}

	disconnectedCallback() {
		this._floor.remove();
		this._objects.remove();
		this._roof.remove();
	}

	set zone(zone: Zone) {
		this._zone = zone;
		this._floor.zone = zone;
		this._objects.zone = zone;
		this._roof.zone = zone;
	}

	get zone() {
		return this._zone;
	}

	set tileSheet(tileSheet: TileSheet) {
		this._tileSheet = tileSheet;
		this._floor.tileSheet = tileSheet;
		this._objects.tileSheet = tileSheet;
		this._roof.tileSheet = tileSheet;
	}

	get tileSheet() {
		return this._tileSheet;
	}
}

export default ZoneEditor;
