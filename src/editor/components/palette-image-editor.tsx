import PaletteView from "./palette-view";
import { Point, Rectangle, Size } from "src/util";
import "./palette-image-editor.scss";

class PaletteImageEditor extends PaletteView {
	public static readonly tagName = "wf-editor-palette-image-editor";
	public colorIndex: number = 0;

	protected connectedCallback() {
		super.connectedCallback();
		this.addEventListener("mousedown", this);
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
		this.image[index] = this.colorIndex;

		e.preventDefault();
		e.stopPropagation();

		this.dispatchEvent(new CustomEvent("change"));
		this.redraw(pointInColors);
	}

	protected disconnectedCallback() {
		document.removeEventListener("mousemove", this);
		document.removeEventListener("mouseup", this);
		this.removeEventListener("mousedown", this);

		super.disconnectedCallback();
	}
}

export default PaletteImageEditor;
