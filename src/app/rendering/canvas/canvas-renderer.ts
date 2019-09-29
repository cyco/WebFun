import { Point, rgb } from "src/util";

import { Renderer } from "src/engine/rendering";
import { Tile } from "src/engine/objects";

const TILE_WIDTH = Tile.WIDTH;
const TILE_HEIGHT = Tile.HEIGHT;

const DefaultTextStyle = {
	textAlign: "left",
	shadowColor: "black",
	shadowBlur: 1,
	shadowOffsetX: 0,
	shadowOffsetY: 1,
	font: '13px "Anonymous Pro", monospace',
	fillStyle: "white"
};

class CanvasRenderer implements Renderer {
	protected _canvas: HTMLCanvasElement;
	protected _ctx: CanvasRenderingContext2D;

	constructor(canvas: HTMLCanvasElement) {
		this._canvas = canvas;

		this._ctx = canvas.getContext("2d");
		this._ctx.globalCompositeOperation = "source-over";
		(this._ctx as any).webkitImageSmoothingEnabled = false;
		this._ctx.imageSmoothingEnabled = false;
		this._ctx.imageSmoothingQuality = "low";
		this._ctx.fillStyle = rgb(0, 0, 0);
		this._ctx.fillRect(0, 0, 288, 288);
	}

	static isSupported() {
		const canvas = document.createElement("canvas");
		return canvas.getContext("2d") !== null;
	}

	clear() {
		this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
	}

	renderImage(image: HTMLImageElement, x: number, y: number) {
		this.drawImage(image, x, y);
	}

	drawImage(image: HTMLImageElement, atX: number, atY: number) {
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

	renderText(text: string, location: Point, style: Partial<typeof DefaultTextStyle> = DefaultTextStyle) {
		const effectiveStyle: typeof DefaultTextStyle = Object.assign({}, DefaultTextStyle, style);
		this._ctx.save();
		this._ctx.globalCompositeOperation = "source-over";
		for (const style of Object.entries(effectiveStyle)) {
			(this._ctx as any)[style[0]] = style[1];
		}

		this._ctx.fillText(text, location.x, location.y + 13 / 2);
		this._ctx.restore();
	}

	redisplayTile(_x: number, _y: number): void {}
	redisplayRect(_x: number, _y: number, _width: number, _height: number): void {}
	redisplay(): void {}
}

export default CanvasRenderer;
