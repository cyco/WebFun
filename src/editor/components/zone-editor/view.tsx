import Component from "src/ui/component";
import LayerComponent from "./zone-layer";
import { Zone } from "src/engine/objects";
import { HEIGHT as TileHeight, WIDTH as TileWidth } from "src/engine/objects/tile";
import { AbstractTool, NoTool } from "src/editor/tools";
import { Point } from "src/util";
import { ContextMenu } from "src/ui/components";
import Layer from "./layer";
import HotspotLayerComponent from "./hotspot-layer";
import NPCLayerComponent from "./npc-layer";
import "./view.scss";

class View extends Component implements EventListenerObject {
	public static readonly tagName = "wf-zone-editor-view";
	public static readonly observedAttributes: string[] = [];
	private _zone: Zone;
	private _floor: LayerComponent;
	private _objects: LayerComponent;
	private _roof: LayerComponent;
	private _hotspots: HotspotLayerComponent;
	private _npcs: NPCLayerComponent;
	private _overlay: HTMLCanvasElement;
	private _tool: AbstractTool;
	private _currentLayer: Layer;

	constructor() {
		super();

		this._hotspots = <HotspotLayerComponent /> as HotspotLayerComponent;
		this._npcs = <NPCLayerComponent /> as NPCLayerComponent;
		this._floor = <LayerComponent layer={Zone.Layer.Floor} /> as LayerComponent;
		this._objects = <LayerComponent layer={Zone.Layer.Object} /> as LayerComponent;
		this._roof = <LayerComponent layer={Zone.Layer.Roof} /> as LayerComponent;

		this._overlay = <canvas className="overlay" /> as HTMLCanvasElement;

		this.tool = new NoTool();
	}

	protected connectedCallback() {
		this.appendChild(this._floor);
		this.appendChild(this._objects);
		this.appendChild(this._roof);
		this.appendChild(this._hotspots);
		this.appendChild(this._npcs);
		this.appendChild(this._overlay);
		this._overlay.addEventListener("contextmenu", this);
	}

	public handleEvent(event: MouseEvent) {
		if (event.type === "contextmenu") {
			event.preventDefault();

			const point = this.extractTileCoordinates(event);
			if (!point) return;
			const items = this.currentLayerNode.getMenuForTile(point);
			if (items.length === 0) return;

			const menu = <ContextMenu menu={items} /> as ContextMenu;
			menu.show(new Point(event.clientX, event.clientY));
		}
	}

	protected extractTileCoordinates(event: MouseEvent) {
		const zone = this.zone;

		const offset = event.offsetIn(this);
		const point = offset.scaleBy(1 / TileWidth).floor();
		if (point.x < 0 || point.y < 0 || point.x >= zone.size.width || point.y >= zone.size.height)
			return null;

		return point;
	}

	protected disconnectedCallback() {
		this._overlay.removeEventListener("contextmenu", this);
		this._floor.remove();
		this._objects.remove();
		this._roof.remove();
		this._hotspots.remove();
		this._npcs.remove();
		this._overlay.remove();
	}

	set zone(zone: Zone) {
		if (this._tool) this._tool.deactivate();

		this._zone = zone;
		this._floor.zone = zone;
		this._objects.zone = zone;
		this._roof.zone = zone;
		this._hotspots.zone = zone;
		this._npcs.zone = zone;

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

	set tool(tool: AbstractTool) {
		if (this._tool) {
			this._tool.deactivate();
		}

		this._tool = tool;

		if (this._tool) {
			this._tool.layer = this._currentLayer;
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

		if (id === -1) return this._hotspots;
		if (id === -2) return this._npcs;

		console.assert(false, "Invalid layer encountered");
	}

	private get currentLayerNode() {
		return this.nodeForLayer(this.currentLayer.id);
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

	public set palette(p) {
		this._hotspots.palette = p;
		this._npcs.palette = p;
		this._floor.palette = p;
		this._roof.palette = p;
		this._objects.palette = p;
	}

	public get palette() {
		return this._floor.palette;
	}
}

export default View;
