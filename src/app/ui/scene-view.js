import { View } from "/ui";
import { rgb } from '/util';
import { SceneManager } from "/engine";

export default class extends View {
	constructor() {
		super(document.createElement("canvas"));

		this._manager = new SceneManager();
		this._setupCanvas();
	}

	_setupCanvas() {
		const canvas = this.element;
		canvas.style.backgroundColor = rgb(0, 0, 0);
		canvas.classList.add("pixelated");
		canvas.width = 288;
		canvas.height = 288;

		let ctx = canvas.getContext("2d");
		ctx.fillStyle = rgb(255, 0, 0);
		ctx.fillRect(0, 0, 288, 288);
	}

	get canvas() {
		return this.element;
	}

	get manager() {
		return this._manager;
	}
}
