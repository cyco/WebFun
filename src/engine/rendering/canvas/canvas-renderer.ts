import AbstractRenderer from "../abstract-renderer";
import DOMImageFactory from "./dom-image-factory";
import Image from "../image";

import { rgb } from "src/util";
import Tile from "../../objects/tile";

const TILE_WIDTH = 32.0;
const TILE_HEIGHT = 32.0;

class CanvasRenderer extends AbstractRenderer {
	static isSupported() {
		const canvas = document.createElement("canvas");
		return canvas.getContext("2d") !== null;
	}

	private _canvas: HTMLCanvasElement;
	private _ctx: CanvasRenderingContext2D;
	private _imageFactory: DOMImageFactory;

	constructor(canvas: HTMLCanvasElement) {
		super();

		this._canvas = canvas;

		this._ctx = canvas.getContext("2d");
		this._ctx.globalCompositeOperation = "source-over";
		this._ctx.webkitImageSmoothingEnabled = false;
		this._ctx.fillStyle = rgb(0, 0, 0);
		this._ctx.fillRect(0, 0, 288, 288);
		this._imageFactory = new DOMImageFactory();
	}

	clear() {
		this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
	}

	clearTile(x: number, y: number, z: number) {
	}

	renderTile(tile: Tile, x: number, y: number, z: number) {
		if (!tile) return;

		this._ctx.drawImage(tile.image.representation, x * TILE_WIDTH, y * TILE_HEIGHT);
	}

	renderImage(image: Image, x: number, y: number) {
		this._ctx.drawImage(image.representation, x, y);
	}

	renderImageData(image: Image, x: number, y: number) {
		this._ctx.putImageData(image.representation, x, y);
	}

	fillBlackRect(x: number, y: number, width: number, height: number) {
		this.fillRect(x, y, width, height, "#000000");
	}

	// debug
	fillRect(x: number, y: number, width: number, height: number, color: string) {
		this._ctx.save();
		this._ctx.fillStyle = color;
		this._ctx.fillRect(x, y, width, height);
		this._ctx.restore();
	}

	fillTile(x: number, y: number, color: string) {
		this.fillRect(x * TILE_WIDTH, y * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT, color);
	}

	get imageFactory() {
		return this._imageFactory;
	}
}

export default CanvasRenderer;
