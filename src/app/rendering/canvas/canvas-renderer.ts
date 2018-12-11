import { Point, rgb } from "src/util";
import { Tile } from "src/engine/objects";
import { Renderer, Image } from "src/engine/rendering";
import DOMImageFactory from "./dom-image-factory";

const TILE_WIDTH = Tile.WIDTH;
const TILE_HEIGHT = Tile.HEIGHT;

class CanvasRenderer extends Renderer {
	protected _canvas: HTMLCanvasElement;
	protected _ctx: CanvasRenderingContext2D;
	protected _imageFactory: DOMImageFactory;
	protected _imageCache: Map<number, Image> = new Map();
	protected _imageLoaders: Map<number, Promise<Image>> = new Map();

	constructor(canvas: HTMLCanvasElement) {
		super();
		this._canvas = canvas;

		this._ctx = canvas.getContext("2d");
		this._ctx.globalCompositeOperation = "source-over";
		(this._ctx as any).webkitImageSmoothingEnabled = false;
		this._ctx.imageSmoothingEnabled = false;
		this._ctx.imageSmoothingQuality = "low";
		this._ctx.fillStyle = rgb(0, 0, 0);
		this._ctx.fillRect(0, 0, 288, 288);
		this._imageFactory = new DOMImageFactory();
	}

	get imageFactory() {
		return this._imageFactory;
	}

	static isSupported() {
		const canvas = document.createElement("canvas");
		return canvas.getContext("2d") !== null;
	}

	clear() {
		this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
	}

	clearTile(_: number, _1: number, _2: number) {}

	renderZoneTile(tile: Tile, x: number, y: number, z: number) {
		this.renderTile(tile, x * TILE_WIDTH, y * TILE_HEIGHT, z);
	}

	renderTile(tile: Tile, x: number, y: number, _: number) {
		if (!tile) return;

		let image = this._imageCache.get(tile.id);
		if (!image) {
			if (this._imageLoaders.has(tile.id)) {
				return;
			}

			const p = this.imageFactory.buildImage(TILE_WIDTH, TILE_HEIGHT, tile.imageData);
			this._imageLoaders.set(tile.id, p);
			p.then(img => {
				this._imageCache.set(tile.id, img);
				this._imageLoaders.delete(tile.id);
			});
			return;
		}

		this.drawImage(image.representation, x, y);
	}

	renderImage(image: HTMLImageElement, x: number, y: number) {
		this.drawImage(image, x, y);
	}

	protected drawImage(image: HTMLImageElement, atX: number, atY: number) {
		this._ctx.drawImage(image, atX, atY);
	}

	renderImageData(image: ImageData, x: number, y: number) {
		this._ctx.putImageData(image, x, y);
	}

	fillBlackRect(x: number, y: number, width: number, height: number) {
		this.fillRect(x, y, width, height, "#000000");
	}

	// debug
	fillRect(x: number, y: number, width: number, height: number, color: string) {
		this._ctx.save();
		this._ctx.globalCompositeOperation = "source-over";
		this._ctx.fillStyle = color;
		this._ctx.fillRect(x, y, width, height);
		this._ctx.restore();
	}

	fillTile(x: number, y: number, color: string) {
		this.fillRect(x * TILE_WIDTH, y * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT, color);
	}

	renderText(text: string, location: Point) {
		this._ctx.save();
		this._ctx.globalCompositeOperation = "source-over";
		this._ctx.textAlign = "left";
		this._ctx.shadowColor = "black";
		this._ctx.shadowBlur = 1;
		this._ctx.shadowOffsetX = 0;
		this._ctx.shadowOffsetY = 1;
		this._ctx.font = '13px "Anonymous Pro", monospace';
		this._ctx.fillStyle = "white";

		this._ctx.fillText(text, location.x, location.y + 13 / 2);
		this._ctx.restore();
	}
}

export default CanvasRenderer;
