import "./interactive-map.scss";

import { ContextMenu } from "src/ui/components";
import Map from "./map";
import { Menu } from "src/ui";
import { Point } from "src/util";
import World from "src/engine/world";
import Sector from "src/engine/sector";
import SectorPreview from "./sector-preview";

export interface InteractiveMapContextMenuProvider {
	contextMenuForSector(item: Sector, at: Point, i: World, of: Map): Menu;
}

class InteractiveMap extends Map implements EventListenerObject {
	public static readonly tagName = "wf-resource-editor-map-interactive";
	private _highlight: SectorPreview = (<SectorPreview />) as SectorPreview;
	private _highlightTile: Point = null;
	public contextMenuProvider: InteractiveMapContextMenuProvider;

	protected connectedCallback(): void {
		super.connectedCallback();

		this._highlight.palette = this.palette;
		this._highlight.style.position = "absolute";
		this._highlight.style.pointerEvents = "none";
		this._highlight.style.zIndex = "1000";

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
		const sector = this.world.at(tile.x, tile.y);
		if (!this.contextMenuProvider) return;
		const menu = this.contextMenuProvider.contextMenuForSector(sector, tile, this.world, this);
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

	protected disconnectedCallback(): void {
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

		const sector = this.world.at(this._highlightTile.x, this._highlightTile.y);
		if (!sector.zone) {
			this._highlight.remove();
			return;
		}

		const { left: x, top: y } = this.getBoundingClientRect();
		this._highlight.sector = sector;
		this._highlight.style.left = `${t.x * 28 + x}px`;
		this._highlight.style.top = `${t.y * 28 + y}px`;
		document.body.appendChild(this._highlight);
	}

	public get highlightTile() {
		return this._highlightTile;
	}
}
export default InteractiveMap;
