import { Component } from '/ui';
import TilePreview from './tile-preview';

export default class extends Component {
	static get TagName() {
		return 'wf-editor-tile-selection';
	}

	constructor() {
		super();

		this._tiles = [];
		this._selectedTile = null;
		this._selectedTileNode = null;
		this.ontilechange = null;
	}

	_draw() {
		this.clear();

		const node = document.createElement(TilePreview.TagName);
		node.tile = null;
		node.onclick = () => this.selectTile(null, node);
		this.appendChild(node);

		this._tiles.forEach(tile => {
			const node = document.createElement(TilePreview.TagName);
			node.tile = tile;
			node.onclick = () => this.selectTile(tile, node);
			this.appendChild(node);
		});
	}

	set tiles(t) {
		this._tiles = t;
		this._draw();
	}

	get tiles() {
		return this._tiles;
	}

	selectTile(tile, node) {
		if (this._selectedTileNode) {
			this._selectedTileNode.removeAttribute('selected');
		}

		this._selectedTile = tile;
		this._selectedTileNode = node;

		if (this._selectedTileNode) {
			this._selectedTileNode.setAttribute('selected', '');
		}

		if (this.ontilechange instanceof Function) {
			this.ontilechange();
		}
	}

	get selectedTile() {
		return this._selectedTile;
	}
}
