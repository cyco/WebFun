import { Component } from "src/ui";
import "./color-wheel.scss";
import { hsv2rgb, polar2xy, rad2deg, rgba, xy2polar } from "src/util";
import Size from "src/util/size";

class ColorWheel extends Component implements EventListenerObject {
	public static readonly TagName = "wf-color-wheel";
	public static readonly observedAttributes = ["color"];
	private _canvas = <HTMLCanvasElement>document.createElement("canvas");
	private _crosshair = <HTMLCanvasElement>document.createElement("canvas");
	private size = new Size(200, 200);
	private radius = this.size.width / 2;
	private crosshairColor = rgba(0, 0, 0, 0.9);

	connectedCallback() {
		const drawnSize = this.size.scaleBy(window.devicePixelRatio);

		this.style.width = `${this.size.width}px`;
		this.style.height = `${this.size.height}px`;
		this._canvas.style.width = `${this.size.width}px`;
		this._canvas.style.height = `${this.size.height}px`;
		this._canvas.width = drawnSize.width;
		this._canvas.height = drawnSize.height;

		this.appendChild(this._canvas);
		this.appendChild(this._crosshair);

		this._crosshair.width = 30;
		this._crosshair.height = 30;
		this._crosshair.style.width = "15px";
		this._crosshair.style.height = "15px";

		this.drawWheel(drawnSize, this.radius * window.devicePixelRatio);
		this.drawCrosshair();

		this.addEventListener("mousedown", this);
	}

	public handleEvent(e: Event) {
		if (!(e instanceof MouseEvent)) return;

		const box = this.getBoundingClientRect();
		const x = e.clientX - box.left;
		const y = e.clientY - box.top;

		if (e.type === "mousedown") {
			document.addEventListener("mousemove", this);
			document.addEventListener("mouseup", this);
		}

		if (e.type === "mouseup") {
			document.removeEventListener("mousemove", this);
			document.removeEventListener("mouseup", this);
		}

		this._moveCrosshair(x, y);

		e.preventDefault();
		e.stopImmediatePropagation();
	}

	private _moveCrosshair(x: number, y: number): void {
		let [rho, theta] = xy2polar(x - this.size.width / 2, y - this.size.height / 2);
		rho = Math.min(rho, this.radius);

		[x, y] = polar2xy(rho, theta);

		this._crosshair.style.left = (x + this.size.width / 2 - 7.5) + "px";
		this._crosshair.style.top = (y + this.size.height / 2 - 7.5) + "px";
	}

	private drawWheel(size: Size, radius = size.width / 2): void {
		const ctx = this._canvas.getContext("2d");
		const image = this.createColorWheelImage(ctx, size);
		ctx.putImageData(image, 0, 0);
	}

	private createColorWheelImage(ctx: CanvasRenderingContext2D, size: Size) {
		const radius = size.width / 2.0;
		const width = size.width;
		const height = size.height;
		const diameter = 2 * radius;
		const image = ctx.createImageData(width, height);
		const data = image.data;

		const centerX = (width - diameter) / 2;
		const centerY = (width - diameter) / 2;

		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				const cx = x - radius - centerX;
				const cy = y - radius - centerY;

				const [rho, theta] = xy2polar(cx, cy);
				if (rho >= radius) continue;

				const [r, g, b] = hsv2rgb(rad2deg(theta), rho / radius, 1);
				const index = y * width + (width - x - 1);

				data[4 * index] = r;
				data[4 * index + 1] = g;
				data[4 * index + 2] = b;
				data[4 * index + 3] = 255;
			}
		}
		return image;
	}

	private drawCrosshair() {
		const ctx = this._crosshair.getContext("2d");

		ctx.strokeStyle = this.crosshairColor;
		ctx.beginPath();
		ctx.ellipse(15, 15, 15 - 4, 15 - 4, 0, 0, 2 * Math.PI);
		ctx.moveTo(0, 15);
		ctx.lineTo(30, 15);
		ctx.moveTo(15, 0);
		ctx.lineTo(15, 30);
		ctx.stroke();
	}

	disconnectedCallback() {
		this._canvas.remove();
		this.removeEventListener("mousedown", this);
	}
}

export default ColorWheel;
