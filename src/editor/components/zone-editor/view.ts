import Component from "src/ui/component";
import LayerComponent from "./zone-layer";
import { Zone } from "src/engine/objects";
import CSSTileSheet from "src/editor/css-tile-sheet";
import { HEIGHT as TileHeight, WIDTH as TileWidth } from "src/engine/objects/tile";
import { AbstractTool, NoTool } from "src/editor/tools";
import { Point } from "src/util";
import "./view.scss";
import Layer from "src/editor/components/zone-editor/layer";

class View extends Component {
	public static readonly TagName = "wf-zone-editor-view";
	public static readonly observedAttributes: string[] = [];
	private _zone: Zone;
	private _floor: LayerComponent;
	private _objects: LayerComponent;
	private _roof: LayerComponent;
	private _overlay: HTMLCanvasElement;
	private _tileSheet: CSSTileSheet;
	private _tool: AbstractTool;
	private _currentLayer: Layer;

	constructor() {
		super();

		this._floor = <LayerComponent>document.createElement(LayerComponent.TagName);
		this._floor.layer = Zone.Layer.Floor;
		this._objects = <LayerComponent>document.createElement(LayerComponent.TagName);
		this._objects.layer = Zone.Layer.Object;
		this._roof = <LayerComponent>document.createElement(LayerComponent.TagName);
		this._roof.layer = Zone.Layer.Roof;

		this._overlay = document.createElement("canvas");
		this._overlay.classList.add("overlay");

		this.tool = new NoTool();
	}

	protected connectedCallback() {
		this.appendChild(this._floor);
		this.appendChild(this._objects);
		this.appendChild(this._roof);
		this.appendChild(this._overlay);
	}

	protected disconnectedCallback() {
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

	set tileSheet(tileSheet: CSSTileSheet) {
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

	public setLayerVisible(layer: Layer, flag: boolean) {
		const layerNode = this.nodeForLayer(layer.id);
		layerNode.style.display = flag ? "" : "none";
	}

	private nodeForLayer(id: number) {
		if (id === Zone.Layer.Roof) return this._roof;
		if (id === Zone.Layer.Object) return this._objects;
		if (id === Zone.Layer.Floor) return this._floor;
		console.assert(false, "Invalid layer encountered");
	}

	public activateTool(tool: AbstractTool) {
		if (this._tool) {
			this._tool.deactivate();
		}

		this._tool = tool;

		if (this._tool) {
			this._tool.layer = this._currentLayer;
			this._tool.activate(this._zone, this._overlay);
		}
	}

	public redraw(points: Point[]): void {
		points.forEach(p => this.nodeForLayer(p.z).update([p]));
	}

	set currentLayer(layer: Layer) {
		this._currentLayer = layer;
		if (this._tool) this._tool.layer = layer;
	}

	get currentLayer(): Layer {
		return this._currentLayer;
	}
}

export default View;
