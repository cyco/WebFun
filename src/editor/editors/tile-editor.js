import { Component } from "src/ui";
import { TileSelection } from "src/editor/components";
import "./tile-editor.scss";

export default class extends Component {
	static get TagName() {
		return "wf-editor-tiles";
	}

	constructor() {
		super();

		this.data = null;
		this._tileSelection = document.createElement(TileSelection.TagName);
	}

	connectedCallback() {
		super.connectedCallback();

		this._tileSelection.tiles = this.data.tiles;
		this.appendChild(this._tileSelection);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.clear();
	}
}
