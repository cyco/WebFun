import Map from "./map";
import { Point } from "src/util";
import ZoneView from "./zone-view";
import "./interactive-map.scss";

class InteractiveMap extends Map implements EventListenerObject {
	public static readonly tagName = "wf-resource-editor-map-interactive";
	private _highlight: ZoneView = <ZoneView /> as ZoneView;
	private _highlightTile: Point = null;

	protected connectedCallback() {
		super.connectedCallback();

		this._highlight.palette = this.palette;
		this._highlight.style.position = "absolute";
		this._highlight.style.pointerEvents = "none";

		this.addEventListener("mousemove", this);
		this.addEventListener("mouseleave", this);
	}

	public handleEvent(event: MouseEvent) {
		const x = event.offsetX;
		const y = event.offsetY;

		let tile = this.tileAtPoint(new Point(x, y));
		if (event.type === "mouseleave" || !this.world.bounds.contains(tile)) {
			tile = null;
		}

		this.highlightTile = tile;
	}

	protected disconnectedCallback() {
		this.removeEventListener("mousemove", this);
		super.disconnectedCallback();
	}

	public set highlightTile(t: Point) {
		if (t === this._highlightTile) return;
		if (t && t.isEqualTo(this._highlightTile)) return;

		this._highlightTile = t;

		if (!this._highlightTile) {
			this._highlight.remove();
			return;
		}

		const worldItem = this.world.getWorldItem(this._highlightTile.x, this._highlightTile.y);
		if (worldItem.zoneId === -1) {
			this._highlight.remove();
			return;
		}

		const zone = this.zones[worldItem.zoneId];
		const { left: x, top: y } = this.getBoundingClientRect();
		this._highlight.zone = zone;
		this._highlight.style.left = `${t.x * 28 + x}px`;
		this._highlight.style.top = `${t.y * 28 + y}px`;
		document.body.appendChild(this._highlight);
	}

	public get highlightTile() {
		return this._highlightTile;
	}
}
export default InteractiveMap;
