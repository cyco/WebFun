import Component from "src/ui/component";
import ZoneLayer from "./zone-layer";
import { Zone } from "src/engine/objects";
import TileSheet from "src/editor/tile-sheet";
import { HEIGHT as TileHeight, WIDTH as TileWidth } from "src/engine/objects/tile";
import { AbstractTool, NoTool } from "src/editor/tools";
import "./view.scss";

class View extends Component {
	public static readonly TagName = "wf-zone-editor-view";
	public static readonly observedAttributes: string[] = [];
	private _zone: Zone;
	private _floor: ZoneLayer;
	private _objects: ZoneLayer;
	private _roof: ZoneLayer;
	private _overlay: HTMLCanvasElement;
	private _tileSheet: TileSheet;
	private _tool: AbstractTool;

	constructor() {
		super();

		this._floor = <ZoneLayer>document.createElement(ZoneLayer.TagName);
		this._floor.layer = Zone.Layer.Floor;
		this._objects = <ZoneLayer>document.createElement(ZoneLayer.TagName);
		this._objects.layer = Zone.Layer.Object;
		this._roof = <ZoneLayer>document.createElement(ZoneLayer.TagName);
		this._roof.layer = Zone.Layer.Roof;

		this._overlay = document.createElement("canvas");
		this._overlay.classList.add("overlay");

		this.tool = new NoTool();
	}

	connectedCallback() {
		this.appendChild(this._floor);
		this.appendChild(this._objects);
		this.appendChild(this._roof);
		this.appendChild(this._overlay);
	}

	disconnectedCallback() {
		this._floor.remove();
		this._objects.remove();
		this._roof.remove();
		this._overlay.remove();
	}

	set zone(zone: Zone) {
		if (this._tool) this._tool.deactivate();

		this._zone = zone;
		this._floor.zone = zone;
		this._objects.zone = zone;
		this._roof.zone = zone;

		this._overlay.style.width = zone.size.width * TileWidth + "px";
		this._overlay.style.height = zone.size.height * TileHeight + "px";
		this._overlay.width = zone.size.width * TileWidth * window.devicePixelRatio;
		this._overlay.height = zone.size.height * TileHeight * window.devicePixelRatio;
		this.style.width = 2 + zone.size.width * TileWidth + "px";
		this.style.height = 2 + zone.size.height * TileHeight + "px";

		if (this._tool) this._tool.activate(this._zone, this._overlay);
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

	set tool(tool: AbstractTool) {
		if (this._tool) {
			this._tool.deactivate();
		}

		this._tool = tool;

		if (this._tool) {
			this._tool.activate(this._zone, this._overlay);
		}
	}

	get tool() {
		return this._tool;
	}
}

export default View;
