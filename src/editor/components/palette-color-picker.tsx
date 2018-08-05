import PaletteView from "./palette-view";
import { Rectangle, Point, Size, Color } from "src/util";
import { floor } from "src/std.math";
import "./palette-color-picker.scss";

class PaletteColorPicker extends PaletteView implements EventListenerObject {
	public static tagName = "wf-editor-palette-color-picker";
	public readonly image = new Uint8Array(16 * 16).map((_, idx) => idx);
	private highlighter: HTMLElement = <div className="highlighter" />;
	private _colorIndex: number = 0;

	protected connectedCallback() {
		super.connectedCallback();
		this.addEventListener("mousedown", this);
		this.appendChild(this.highlighter);
	}

	public handleEvent(e: MouseEvent) {
		if (e.which !== 1) return;

		if (e.type === "mouseup") {
			document.removeEventListener("mousemove", this);
			document.removeEventListener("mouseup", this);
		}

		const point = new Point(e.clientX, e.clientY);
		const { width, height, top, left } = this.getBoundingClientRect();
		const bounds = new Rectangle(new Point(left, top), new Size(width, height));
		if (!bounds.contains(point)) {
			return;
		}

		if (e.type === "mousedown") {
			document.addEventListener("mousemove", this);
			document.addEventListener("mouseup", this);
		}

		const pointInBounds = point.subtract(bounds.origin);
		const pointInColors = pointInBounds.dividedBy(this.pixelSize).floor();
		if (!new Rectangle(new Point(0, 0), this.size).contains(pointInColors)) {
			return;
		}
		const index = pointInColors.x + pointInColors.y * this.size.width;

		e.preventDefault();
		e.stopPropagation();

		if (index === this._colorIndex) return;
		this._colorIndex = index;
		this._highlightCurrentColor();
		this.dispatchEvent(new CustomEvent("change"));
	}

	protected disconnectedCallback() {
		document.removeEventListener("mousemove", this);
		document.removeEventListener("mouseup", this);
		this.removeEventListener("mousedown", this);

		this.highlighter.remove();
		super.disconnectedCallback();
	}

	private _moveHighlightTo(point: Point) {
		const { width, height } = this.pixelSize;
		this.highlighter.style.width = `${width + 2}px`;
		this.highlighter.style.height = `${height + 2}px`;
		this.highlighter.style.left = `${width * point.x - 1}px`;
		this.highlighter.style.top = `${height * point.y - 1}px`;
	}

	set color(c: string | Color) {
		this._colorIndex = this._findColorIndex(new Color(c));
		this._highlightCurrentColor();
	}

	get color(): string | Color {
		const i = this._colorIndex;
		return new Color(
			this.palette[i * 4 + 2],
			this.palette[i * 4 + 1],
			this.palette[i * 4 + 0],
			this.palette[i * 4 + 3]
		);
	}

	get colorIndex() {
		return this._colorIndex;
	}

	public updateCurrentColor(color: Color | string) {
		const { palette: p, _colorIndex: i } = this;
		[p[i * 4 + 2], p[i * 4 + 1], p[i * 4 + 0], p[i * 4 + 3]] = new Color(color).rgbaComponents;
		this.redraw(
			new Point(this._colorIndex % this.size.width, floor(this._colorIndex / this.size.width))
		);
	}

	private _highlightCurrentColor() {
		if (!this.palette) return;
		if (!this.image) return;

		if (this._colorIndex === -1) {
			this.highlighter.style.opacity = "0";
			this._moveHighlightTo(new Point(0, 0));
			this._colorIndex = 0;
			return;
		}

		const point = this._findPositionForColorIndex(this._colorIndex);
		if (!point) {
			console.warn("color", this._colorIndex, "could not be found");
			return;
		}
		this.highlighter.style.opacity = "1";
		this._moveHighlightTo(point);
	}

	private _findColorIndex(c: Color): number {
		const { palette } = this;
		const [r, g, b, a] = c.rgbaComponents;
		for (let i = 0; i < palette.length; i += 4) {
			if (
				r === palette[i + 2] &&
				g === palette[i + 1] &&
				b === palette[i + 0] &&
				a === palette[i + 3]
			) {
				return i;
			}
		}

		return -1;
	}

	private _findPositionForColorIndex(colorIndex: number): Point {
		for (let y = 0; y < this.size.height; y++) {
			for (let x = 0; x < this.size.width; x++) {
				const i = y * this.size.width + x;

				if (this.image[i] === colorIndex) return new Point(x, y);
			}
		}

		return null;
	}
}

export default PaletteColorPicker;
