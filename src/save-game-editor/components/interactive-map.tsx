import "./interactive-map.scss";

import { ContextMenu } from "src/ui/components";
import Map from "./map";
import { Menu } from "src/ui";
import { Point } from "src/util";
import { World } from "src/engine/save-game";
import WorldItem from "../world-item";
import ZoneView from "./zone-view";

export interface InteractiveMapContextMenuProvider {
	contextMenuForWorldItem(item: WorldItem, at: Point, i: World, of: Map): Menu;
}

class InteractiveMap extends Map implements EventListenerObject {
	public static readonly tagName = "wf-resource-editor-map-interactive";
	private _highlight: ZoneView = <ZoneView /> as ZoneView;
	private _highlightTile: Point = null;
	public contextMenuProvider: InteractiveMapContextMenuProvider;

	protected connectedCallback() {
		super.connectedCallback();

		this._highlight.palette = this.palette;
		this._highlight.style.position = "absolute";
		this._highlight.style.pointerEvents = "none";

		this.addEventListener("mousemove", this);
		this.addEventListener("mouseleave", this);
		this.addEventListener("contextmenu", this);
	}

	public handleEvent(event: MouseEvent) {
		const x = event.offsetX;
		const y = event.offsetY;

		let tile = this.tileAtPoint(new Point(x, y));
		if (event.type === "contextmenu") {
			const { top, left } = this.getBoundingClientRect();
			this._showMenuForTile(tile, new Point(x + left, y + top));
			event.preventDefault();
			event.stopPropagation();
			return;
		}

		if (event.type === "mouseleave" || !this.world.bounds.contains(tile)) {
			tile = null;
		}

		this.highlightTile = tile;
	}

	private _showMenuForTile(tile: Point, raw: Point) {
		const worldItem = this.world.getWorldItem(tile.x, tile.y);
		if (!this.contextMenuProvider) return;
		const menu = this.contextMenuProvider.contextMenuForWorldItem(worldItem, tile, this.world, this);
		if (!menu || menu.items.length === 0) return;

		this.highlightTile = null;
		this.removeEventListener("mousemove", this);
		this.removeEventListener("mouseleave", this);

		const menuNode = document.createElement(ContextMenu.tagName) as ContextMenu;
		menuNode.menu = menu;
		menuNode.onclose = () => {
			this.addEventListener("mousemove", this);
			this.addEventListener("mouseleave", this);
		};
		menuNode.show(raw);
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
