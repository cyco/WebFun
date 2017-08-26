import { Component } from "/ui";
import TilePreview from "./tile-preview";
import "./tile-selection.scss";

export default class extends Component {
	static get TagName() {
		return "wf-editor-tile-selection";
	}

	constructor() {
		super();

		this._tiles = [];
		this._selectedTile = null;
		this._selectedTileNode = null;
		this.ontilechange = null;
		this._tileNodes = [];
	}

	_draw() {
		this.clear();

		const node = document.createElement(TilePreview.TagName);
		node.tile = null;
		node.onclick = () => this.selectTile(null);
		this.appendChild(node);

		this._tileNodes = this._tiles.map(tile => {
			const node = document.createElement(TilePreview.TagName);
			node.tile = tile;
			node.onclick = () => this.selectTile(tile);
			this.appendChild(node);

			return node;
		});
	}

	set tiles(t) {
		this._tiles = t;
		this._draw();
	}

	get tiles() {
		return this._tiles;
	}

	selectTile(tile) {
		this.selectedTile = tile;

		if (this.ontilechange instanceof Function) {
			this.ontilechange();
		}
	}

	get selectedTile() {
		return this._selectedTile;
	}

	set selectedTile(t) {
		let node = t === null ? this.firstElementChild : this._tileNodes[t.id];

		if (this._selectedTileNode) {
			this._selectedTileNode.removeAttribute("selected");
		}

		this._selectedTile = t;
		this._selectedTileNode = node;

		if (this._selectedTileNode) {
			this._selectedTileNode.setAttribute("selected", "");
			this._selectedTileNode.scrollIntoViewIfNeeded();
		}
	}
}
