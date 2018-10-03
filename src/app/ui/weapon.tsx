import GameData from "src/engine/game-data";
import { Char } from "src/engine/objects";
import { Component } from "src/ui";
import { Image } from "src/std/dom";
import "./weapon.scss";

class Weapon extends Component {
	public static tagName = "wf-weapon";
	public data: GameData = null;
	private _weapon: Char = null;
	private _background: HTMLDivElement = <div className="background" /> as HTMLDivElement;
	private _tileContainer: HTMLImageElement = <img className="pixelated" /> as HTMLImageElement;

	protected connectedCallback() {
		this.appendChild(this._background);
		this.appendChild(this._tileContainer);
	}

	private _update() {
		let url = Image.blankImage;
		this._tileContainer.style.backgroundPosition = "";
		if (this._weapon && this._weapon.frames && this._weapon.frames.length) {
			const tile = this._weapon.frames[0].extensionRight;
			if (tile) {
				if (tile.image.representation && tile.image.representation.dataURL)
					url = tile.image.representation.dataURL;
				this._tileContainer.style.backgroundImage = url;
			}
		}
		this._tileContainer.src = url;
	}

	set weapon(w: Char) {
		this._weapon = w;
		this._update();
	}

	get weapon(): Char {
		return this._weapon;
	}
}

export default Weapon;
