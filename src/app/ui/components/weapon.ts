import { Component } from "src/ui";
import "./weapon.scss";

import GameData from "src/engine/game-data";

class Weapon extends Component {
	public static TagName = "wf-weapon";
	private _weapon: any;
	private _background: HTMLDivElement;
	private _tileContainer: HTMLImageElement;
	public data: GameData;

	constructor() {
		super();

		this._weapon = null;
		this.data = null;

		const background = document.createElement("div");
		background.classList.add("background");
		this._background = background;

		this._tileContainer = document.createElement("img");
		this._tileContainer.classList.add("pixelated");
	}

	connectedCallback() {
		this.appendChild(this._background);
		this.appendChild(this._tileContainer);
	}

	_update() {
		let url = (<any>Image).blankImage;
		this._tileContainer.style.backgroundPosition = "";
		if (this._weapon && this._weapon.frames && this._weapon.frames.length) {
			const tileID = this._weapon.frames[0].extensionRight;
			if (tileID !== 0xFFFF && tileID !== -1) {
				const tile = this.data.tiles[tileID];
				url = tile.image.dataURL;
				this._tileContainer.style.backgroundImage = url;
			}
		}
		this._tileContainer.src = url;
	}

	get weapon() {
		return this._weapon;
	}

	set weapon(w) {
		this._weapon = w;
		this._update();
	}
}

export default Weapon;
