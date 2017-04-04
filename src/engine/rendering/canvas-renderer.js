import Renderer from './renderer';
import Tile from '/game/objects/tile';
export default class CanvasRenderer extends Renderer {
	constructor(canvas) {
		super();

		this._canvas = canvas;
		this._ctx = canvas.getContext('2d');
		this._ctx.globalCompositeOperation = 'source-over';
		this._ctx.webkitImageSmoothingEnabled = false;
	}

	clear() {
		this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
	}

	clearTile(x, y, z) {

	}

	renderTile(tile, x, y, z) {
		if (!tile) return;

		const tileWidth = Tile.WIDTH;
		const tileHeight = Tile.HEIGHT;
		this._ctx.drawImage(tile.image.imageNode, x * tileWidth, y * tileHeight);
	}

	renderImage(image, x, y) {
		this._ctx.drawImage(image.imageNode, x, y);
	}

	renderImageNode(image, x, y) {
		this._ctx.drawImage(image, x, y);
	}

	renderImageData(image, x, y) {
		this._ctx.putImageData(image, x, y);
	}

	fillBlackRect(x, y, width, height) {
		this._ctx.save();
		this._ctx.fillStyle = '#000000';
		this._ctx.fillRect(x, y, width, height);
		this._ctx.restore();
	}

	// debug
	fillRect(x, y, width, height, color) {
		this._ctx.save();
		this._ctx.fillStyle = color;
		this._ctx.fillRect(x, y, width, height);
		this._ctx.restore();
	}

	fillTile(x, y, color) {
		this.fillRect(x * Tile.WIDTH, y * Tile.HEIGHT, Tile.WIDTH, Tile.HEIGHT, color);
	}
}
