import { Component } from "src/ui";
import "./color-wheel.scss";
import { Color, deg2rad, dispatch, hsv2rgb, polar2xy, rad2deg, rgba, Size, xy2polar } from "src/util";

class ColorWheel extends Component implements EventListenerObject {
	public static readonly TagName = "wf-color-wheel";
	public static readonly observedAttributes: string[] = ["color"];

	private size = new Size(100, 100);
	private radius = this.size.width / 2;
	private _hue: number;
	private _saturation: number;
	private _brightness: number;

	private _canvas: HTMLCanvasElement;
	private _image: ImageData;
	private _crosshair: HTMLCanvasElement;
	private _crosshairColor = rgba(0, 0, 0, 0.9);
	private _interactionInProgress = false;

	constructor() {
		super();

		this._canvas = <HTMLCanvasElement>document.createElement("canvas");
		this._crosshair = <HTMLCanvasElement>document.createElement("canvas");

		this._crosshair.width = 30;
		this._crosshair.height = 30;
		this._crosshair.style.width = "15px";
		this._crosshair.style.height = "15px";

		this.color = new Color(0, 0, 0, 0);
	}

	connectedCallback() {
		this.appendChild(this._canvas);
		this.appendChild(this._crosshair);

		this.drawCrosshair();
		this.update();

		this.addEventListener("mousedown", this);
	}

	private update() {
		if (!this.isConnected) return;
		const ctx = this._canvas.getContext("2d");
		const drawnSize = this.size.scaleBy(window.devicePixelRatio);

		if (!this._image) {
			this.style.width = `${this.size.width}px`;
			this.style.height = `${this.size.height}px`;
			this._canvas.style.width = `${this.size.width}px`;
			this._canvas.style.height = `${this.size.height}px`;
			this._canvas.width = drawnSize.width;
			this._canvas.height = drawnSize.height;

			this._image = this.createColorWheelImage(ctx, drawnSize);
		}

		ctx.clearRect(0, 0, drawnSize.width, drawnSize.height);
		ctx.putImageData(this._image, 0, 0);
		ctx.fillStyle = rgba(0, 0, 0, 1 - this._brightness);
		ctx.fillRect(0, 0, drawnSize.width, drawnSize.height);

		this._crosshair.style.filter = this._brightness <= 0.5 ? "invert()" : "";
	}

	public handleEvent(e: Event) {
		if (!(e instanceof MouseEvent)) return;

		if (e.type === "mousedown") {
			this._interactionInProgress = true;
			document.addEventListener("mousemove", this);
			document.addEventListener("mouseup", this);
		}

		if (e.type === "mouseup") {
			dispatch(() => (this._interactionInProgress = false));
			document.removeEventListener("mousemove", this);
			document.removeEventListener("mouseup", this);
		}

		const box = this.getBoundingClientRect();
		const x = e.clientX - box.left;
		const y = e.clientY - box.top;
		this._moveCrosshair(x, y);

		e.preventDefault();
		e.stopImmediatePropagation();
	}

	private _moveCrosshair(x: number, y: number): void {
		let [rho, theta] = xy2polar(x - this.size.width / 2, y - this.size.height / 2);
		rho = Math.min(rho / this.radius, 1);

		this._hue = rad2deg(theta);
		this._saturation = rho;

		this._moveCrosshairToCurrentColor();
		this.dispatchEvent(new Event("change"));
	}

	private _moveCrosshairToCurrentColor() {
		const [x, y] = polar2xy(this._saturation * this.radius, deg2rad(this._hue));

		this._crosshair.style.left = x + this.size.width / 2 - 7.5 + "px";
		this._crosshair.style.top = y + this.size.height / 2 - 7.5 + "px";
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
				if (rho > radius) continue;

				const [r, g, b] = hsv2rgb(rad2deg(theta), rho / radius, 1);
				const index = y * width + x;

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

		ctx.strokeStyle = this._crosshairColor;
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

		this.textContent = "";
	}

	public attributeChangedCallback(attr: string, old: string, newValue: string) {
		if (attr === "color") this.color = newValue;
	}

	public adjustBrightness(value: number): void {
		if (value === this._brightness) return;

		this._brightness = value;
		this.update();
	}

	set color(c: string | Color) {
		const color = new Color(c);

		const [hue, saturation, brightness] = color.hsvComponents;
		this._hue = hue;
		this._saturation = saturation;

		if (brightness !== this._brightness) {
			this._brightness = brightness;
			this.update();
		}

		if (!this._interactionInProgress) {
			this._crosshair.classList.add("animated");
			const transitionEnd = () => {
				this._crosshair.classList.remove("animated");
				this._crosshair.removeEventListener("transitionend", transitionEnd);
			};
			this._crosshair.addEventListener("transitionend", transitionEnd);
		}

		this._moveCrosshairToCurrentColor();
	}

	get color(): Color | string {
		return Color.FromHSV(this._hue, this._saturation, this._brightness);
	}
}

export default ColorWheel;
