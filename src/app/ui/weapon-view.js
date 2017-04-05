import { View } from "/ui";

export default class WeaponView extends View {
	constructor(element) {
		super(element);

		this._weapon = null;
		this.data = null;

		this.element.classList.add("weapon-view");

		const background = document.createElement("div");
		background.classList.add("background");
		this.element.appendChild(background);

		this._tileContainer = document.createElement("img");
		this._tileContainer.classList.add("pixelated");
		this.element.appendChild(this._tileContainer);

		Object.seal(this);
	}

	get weapon() {
		return this._weapon;
	}

	set weapon(w) {
		this._weapon = w;
		this._update();
	}

	_update() {
		let url = Image.blankImage;
		this._tileContainer.style.backgroundPosition = "";
		if (this._weapon && this._weapon.frames && this._weapon.frames.length) {
			const tileID = this._weapon.frames[0].extensionRight;
			if (tileID !== 0xFFFF) {
				const tile = this.data.tiles[tileID];
				url = tile.image.dataURL;
				this._tileContainer.style.backgroundImage = url;
			}
		}
		this._tileContainer.src = url;
	}
}
