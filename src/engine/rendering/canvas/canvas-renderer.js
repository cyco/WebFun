import Renderer from "../renderer";

const TILE_WIDTH = 32.0;
const TILE_HEIGHT = 32.0;

export default class CanvasRenderer extends Renderer {
	constructor(canvas) {
		super();

		this._canvas = canvas;
		this._ctx = canvas.getContext("2d");
		this._ctx.globalCompositeOperation = "source-over";
		this._ctx.webkitImageSmoothingEnabled = false;
	}

	clear() {
		this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
	}

	clearTile(x, y, z) {}

	renderTile(tile, x, y, z) {
		if (!tile) return;

		this._ctx.drawImage(tile.image.representation, x * TILE_WIDTH, y * TILE_HEIGHT);
	}

	renderImage(image, x, y) {
		this._ctx.drawImage(image.representation, x, y);
	}

	renderImageData(image, x, y) {
		this._ctx.putImageData(image, x, y);
	}

	fillBlackRect(x, y, width, height) {
		this.fillRect(x, y, width, height, '#000000');
	}

	// debug
	fillRect(x, y, width, height, color) {
		this._ctx.save();
		this._ctx.fillStyle = color;
		this._ctx.fillRect(x, y, width, height);
		this._ctx.restore();
	}

	fillTile(x, y, color) {
		this.fillRect(x * TILE_WIDTH, y * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT, color);
	}
}
