import { View } from "/ui";

export default class extends View {
	constructor() {
		super(document.createElement("canvas"));

		this._setupCanvas();
	}

	_setupCanvas() {
		const canvas = this.element;
		canvas.classList.add("pixelated");
		canvas.width = 288;
		canvas.height = 288;

		let ctx = canvas.getContext("2d");
		ctx.fillStyle = "#FF0000";
		ctx.fillRect(0, 0, 288, 288);
	}

	get canvas() {
		return this.element;
	}
}
