import Component from "src/ui/component";
import ZoneLayer from "src/editor/components/zone-layer";
import "./zone-editor.scss";
import { Zone } from "src/engine/objects";

class ZoneEditor extends Component {
	public static readonly TagName = "wf-zone-editor";
	public static readonly observedAttributes: string[] = [];
	private _zone: Zone;
	private _floor: ZoneLayer;
	private _objects: ZoneLayer;
	private _roof: ZoneLayer;

	constructor() {
		super();

		this._floor = <ZoneLayer>document.createElement(ZoneLayer.TagName);
		this._floor.layer = Zone.Layer.Floor;
		this._objects = <ZoneLayer>document.createElement(ZoneLayer.TagName);
		this._floor.layer = Zone.Layer.Object;
		this._roof = <ZoneLayer>document.createElement(ZoneLayer.TagName);
		this._floor.layer = Zone.Layer.Roof;
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
}

export default ZoneEditor;
