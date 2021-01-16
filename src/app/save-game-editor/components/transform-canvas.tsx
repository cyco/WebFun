import "./transform-canvas.scss";

import { Component } from "src/ui";
import { Point } from "src/util";

export interface TransformCanvasRenderingContext2D extends CanvasRenderingContext2D {
	transformedPoint(x: number, y: number): SVGPoint;
	getTransform(): SVGMatrix;
}

class TransformCanvas extends Component implements EventListenerObject {
	static tagName = "wf-save-game-editor-canvas";
	private _canvas = (<canvas />) as HTMLCanvasElement;
	public draw: (ctx: TransformCanvasRenderingContext2D) => void = () => {};
	private scaleFactor = 1.1;

	private lastMouse: Point;

	private dragStart: SVGPoint;
	private dragged: boolean;

	public constructor() {
		super();

		this.trackTransforms();
	}

	protected connectedCallback(): void {
		const canvas = this._canvas;
		super.connectedCallback();
		this.lastMouse = new Point(this.width / 2, this.height / 2);
		this.appendChild(this._canvas);

		canvas.addEventListener("DOMMouseScroll", this, false);
		canvas.addEventListener("mousewheel", this, false);
		canvas.addEventListener("mouseup", this, false);
		canvas.addEventListener("mousemove", this, false);
		canvas.addEventListener("mousedown", this, false);

		this.redraw();
	}

	protected disconnectedCallback(): void {
		const canvas = this._canvas;
		canvas.removeEventListener("DOMMouseScroll", this, false);
		canvas.removeEventListener("mousewheel", this, false);
		canvas.removeEventListener("mouseup", this, false);
		canvas.removeEventListener("mousemove", this, false);
		canvas.removeEventListener("mousedown", this, false);

		super.disconnectedCallback();
	}

	public handleEvent(event: MouseEvent): void {
		const canvas = this._canvas;
		const ctx = this.getContext("2d");
		switch (event.type) {
			case "mousewheel":
			case "DOMMouseScroll":
				const delta = (event as any).wheelDelta
					? (event as any).wheelDelta / 40
					: event.detail
					? -event.detail
					: 0;
				if (delta) this.zoom(delta);
				event.preventDefault();
				break;
			case "mousedown":
				document.body.style.userSelect = "none";
				this.lastMouse = new Point(
					event.offsetX || event.pageX - canvas.offsetLeft,
					event.offsetY || event.pageY - canvas.offsetTop
				);
				this.dragStart = ctx.transformedPoint(this.lastMouse.x, this.lastMouse.y);
				this.dragged = false;

				break;
			case "mousemove":
				this.lastMouse = new Point(
					event.offsetX || event.pageX - canvas.offsetLeft,
					event.offsetY || event.pageY - canvas.offsetTop
				);

				this.dragged = true;
				if (this.dragStart) {
					const pt = ctx.transformedPoint(this.lastMouse.x, this.lastMouse.y);
					ctx.translate(pt.x - this.dragStart.x, pt.y - this.dragStart.y);
					this.redraw();
					break;
				}

			case "mouseup":
				this.dragStart = null;
				if (!this.dragged) this.zoom(event.shiftKey ? -1 : 1);
				break;
		}
	}

	public redraw(): void {
		this.draw(this.getContext("2d"));
	}

	public zoom(clicks: number): void {
		const ctx = this.getContext("2d");
		const pt = ctx.transformedPoint(this.lastMouse.x, this.lastMouse.y);
		ctx.translate(pt.x, pt.y);
		const factor = Math.pow(this.scaleFactor, clicks);
		ctx.scale(factor, factor);
		ctx.translate(-pt.x, -pt.y);
		this.redraw();
	}

	public getContext(type: "2d"): TransformCanvasRenderingContext2D {
		return (this._canvas.getContext(type) as any) as TransformCanvasRenderingContext2D;
	}

	private trackTransforms() {
		const ctx = this.getContext("2d");
		const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		let xform = svg.createSVGMatrix() as SVGMatrix;
		ctx.getTransform = function () {
			return xform;
		};

		const savedTransforms: SVGMatrix[] = [];
		const save = ctx.save;
		ctx.save = function () {
			savedTransforms.push(xform.translate(0, 0));
			return save.call(ctx);
		};

		const restore = ctx.restore;
		ctx.restore = function () {
			xform = savedTransforms.pop();
			return restore.call(ctx);
		};

		const scale = ctx.scale;
		ctx.scale = function (sx: number, sy: number) {
			xform = xform.scale(sx, sy);
			return scale.call(ctx, sx, sy);
		};

		const rotate = ctx.rotate;
		ctx.rotate = function (radians: number) {
			xform = xform.rotate((radians * 180) / Math.PI);
			return rotate.call(ctx, radians);
		};

		const translate = ctx.translate;
		ctx.translate = function (dx: number, dy: number) {
			xform = xform.translate(dx, dy);
			return translate.call(ctx, dx, dy);
		};

		const transform = ctx.transform;
		ctx.transform = function (a: number, b: number, c: number, d: number, e: number, f: number) {
			const m2 = svg.createSVGMatrix();
			m2.a = a;
			m2.b = b;
			m2.c = c;
			m2.d = d;
			m2.e = e;
			m2.f = f;
			xform = xform.multiply(m2);
			return transform.call(ctx, a, b, c, d, e, f);
		};

		const setTransform = ctx.setTransform;
		ctx.setTransform = function (
			a?: DOMMatrix2DInit | number,
			b?: number,
			c?: number,
			d?: number,
			e?: number,
			f?: number
		): void {
			if (typeof a !== "number") return;

			xform.a = a;
			xform.b = b;
			xform.c = c;
			xform.d = d;
			xform.e = e;
			xform.f = f;
			return setTransform.call(ctx, a, b, c, d, e, f);
		};

		const pt = svg.createSVGPoint();
		ctx.transformedPoint = function (x: number, y: number): SVGPoint {
			pt.x = x;
			pt.y = y;
			return pt.matrixTransform(xform.inverse());
		};
	}

	set width(w: number) {
		this._canvas.width = w;
	}

	get width(): number {
		return this._canvas.width;
	}

	set height(w: number) {
		this._canvas.height = w;
	}

	get height(): number {
		return this._canvas.height;
	}
}

export default TransformCanvas;
