import "./weapon.scss";

import { Character, Tile } from "src/engine/objects";
import { ColorPalette } from "src/engine/rendering";
import { Component } from "src/ui";
import { PaletteView } from "src/app/webfun/ui";
import { Size } from "src/util";
import { AssetManager } from "src/engine";

class Weapon extends Component {
	public static readonly tagName = "wf-weapon";
	public assets: AssetManager = null;
	private _weapon: Character = null;
	private _background: HTMLDivElement = (<div className="background" />) as HTMLDivElement;
	private _paletteView: PaletteView = (
		<PaletteView size={new Size(Tile.WIDTH, Tile.HEIGHT)} />
	) as PaletteView;

	protected connectedCallback(): void {
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

	set weapon(w: Character) {
		this._weapon = w;
		this._update();
	}

	get weapon(): Character {
		return this._weapon;
	}

	set palette(p: ColorPalette) {
		this._paletteView.palette = p;
	}

	get palette(): ColorPalette {
		return this._paletteView.palette;
	}
}

export default Weapon;
