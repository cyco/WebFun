import GameData from "src/engine/game-data";
import { Char, Tile } from "src/engine/objects";
import { Component } from "src/ui";
import { Size } from "src/util";
import { PaletteView } from "src/editor/components";
import { ColorPalette } from "src/engine/rendering";
import "./weapon.scss";

class Weapon extends Component {
	public static readonly tagName = "wf-weapon";
	public data: GameData = null;
	private _weapon: Char = null;
	private _background: HTMLDivElement = <div className="background" /> as HTMLDivElement;
	private _paletteView: PaletteView = (
		<PaletteView size={new Size(Tile.WIDTH, Tile.HEIGHT)} />
	) as PaletteView;

	protected connectedCallback() {
		this.appendChild(this._background);
		this.appendChild(this._paletteView);
	}

	private _update() {
		this._paletteView.image = null;
		if (this._weapon && this._weapon.frames && this._weapon.frames.length) {
			const tile = this._weapon.frames[0].extensionRight;
			this._paletteView.image = tile ? tile.imageData : null;
		}
	}

	set weapon(w: Char) {
		this._weapon = w;
		this._update();
	}

	get weapon(): Char {
		return this._weapon;
	}

	set palette(p: ColorPalette) {
		this._paletteView.palette = p;
	}

	get palette() {
		return this._paletteView.palette;
	}
}

export default Weapon;
