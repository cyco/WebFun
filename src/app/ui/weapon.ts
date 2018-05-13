import GameData from "src/engine/game-data";
import { Component } from "src/ui";
import "./weapon.scss";

class Weapon extends Component {
	public static tagName = "wf-weapon";
	public data: GameData;
	private _weapon: any;
	private _background: HTMLDivElement;
	private _tileContainer: HTMLImageElement;

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

	get weapon() {
		return this._weapon;
	}

	set weapon(w) {
		this._weapon = w;
		this._update();
	}

	protected connectedCallback() {
		this.appendChild(this._background);
		this.appendChild(this._tileContainer);
	}

	_update() {
		let url = (<any>Image).blankImage;
		this._tileContainer.style.backgroundPosition = "";
		if (this._weapon && this._weapon.frames && this._weapon.frames.length) {
			const tileID = this._weapon.frames[0].extensionRight;
			if (tileID !== 0xffff && tileID !== -1) {
				const tile = this.data.tiles[tileID];
				if (tile.image.representation && tile.image.representation.dataURL)
					url = tile.image.representation.dataURL;
				this._tileContainer.style.backgroundImage = url;
			}
		}
		this._tileContainer.src = url;
	}
}

export default Weapon;
