import { Component } from "src/ui";
import "./onscreen-pad.scss";
import { min, max } from "src/std/math";
import InputMask from "src/engine/input/input-mask";
import { Point, Direction as DirectionHelper, xy2polar, rad2deg } from "src/util";
import { Settings } from "src";

const BaseSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42.32 42.32"><path d="M28.046 0q1.323 0 1.323 1.323v10.583l-8.07 8.07-8.07-8.07V1.323Q13.23 0 14.552 0h13.494m.264 1.323q0-.265-.264-.265H14.552q-.264 0-.264.265V11.47l7.011 7.011 7.011-7.011V1.323" fill="#6d6d6d"/><path d="M21.431 3.969q-.106 0-.185.08l-1.323 1.335h-.013q-.08.08-.066.172l.013.106q.066.159.238.159h2.66q.171 0 .237-.159.066-.159-.053-.278l-1.336-1.336q-.08-.08-.172-.08"/><path d="M28.31 1.323V11.47l-7.01 7.01-7.011-7.011V1.323q0-.265.264-.265h13.494q.264 0 .264.265" fill="#cac6bc"/><path d="M21.431 3.969q.093 0 .172.08l1.336 1.335q.12.12.053.278-.066.159-.238.159h-2.659q-.172 0-.238-.159l-.013-.106q-.013-.092.066-.172h.013l1.323-1.336q.08-.08.185-.08" fill="#6d6d6d"/><path d="M41.262 14.552v13.494q0 .264-.265.264h-9.869l-7.011-7.01 7.011-7.012h9.87q.264 0 .264.265" fill="#cac6bc"/><path d="M36.95 19.923q-.12-.119-.279-.053-.158.066-.158.238v2.66q0 .171.158.238l.106.013.172-.066v-.014l1.336-1.323.08-.185-.08-.172-1.336-1.336"/><path d="M36.95 19.923l1.335 1.336.08.172-.08.185-1.336 1.323v.014l-.172.066-.106-.013q-.158-.067-.158-.239v-2.659q0-.172.158-.238.159-.066.278.053" fill="#6d6d6d"/><path d="M41.262 14.552c0-.176-.088-.265-.265-.265h-9.869L24.117 21.3l7.011 7.011h9.87c.176 0 .264-.088.264-.264V14.552m-10.57-1.323H42.32c.882 0 0-.882 0 0v16.14c0 .882.882 0 0 0H30.692l-8.07-8.07 8.07-8.07" fill="#6d6d6d"/><path d="M21.431 38.365l.172-.08 1.336-1.336q.12-.119.053-.278-.066-.159-.238-.159h-2.659q-.172 0-.238.16l-.013.105q-.013.093.066.172h.013l1.323 1.336.185.08" stroke="#00f" stroke-width=".265"/><path d="M28.31 31.128v9.87q0 .264-.264.264H14.552q-.264 0-.264-.265v-9.869l7.011-7.011 7.011 7.011" fill="#cac6bc"/><path d="M21.431 38.365l-.185-.08-1.323-1.336h-.013q-.08-.08-.066-.172l.013-.106q.066-.159.238-.159h2.66q.171 0 .237.16.066.158-.053.277l-1.336 1.336-.172.08" fill="#6d6d6d"/><path d="M28.31 31.128l-7.01-7.011-7.011 7.011v9.87q0 .264.264.264h13.494q.264 0 .264-.265v-9.869M21.3 22.622l8.07 8.07v10.305q0 1.323-1.323 1.323H14.552q-1.323 0-1.323-1.323V30.692l8.07-8.07" fill="#6d6d6d"/><path d="M1.323 14.287H11.47l7.01 7.013-7.01 7.01H1.323q-.265 0-.265-.264V14.552q0-.265.265-.265" fill="#cac6bc"/><path d="M5.662 19.87q-.159-.066-.278.053L4.048 21.26q-.08.08-.08.172 0 .106.08.185l1.336 1.323v.014q.08.079.172.066l.106-.013q.159-.067.159-.239v-2.659q0-.172-.159-.238"/><path d="M5.662 19.87q.159.066.159.238v2.66q0 .171-.159.238l-.106.013q-.092.013-.172-.066v-.014l-1.336-1.323q-.08-.079-.08-.185 0-.092.08-.172l1.336-1.336q.12-.119.278-.053" fill="#6d6d6d"/><path d="M0 14.552q0-1.323 1.323-1.323h10.583l8.07 8.07-8.07 8.07H1.323Q0 29.369 0 28.046V14.552m1.323-.265q-.265 0-.265.265v13.494q0 .264.265.264H11.47l7.01-7.01-7.011-7.012H1.323" fill="#6d6d6d"/></svg>`;

const r = (t: string): SVGSVGElement => {
	const d = <div></div>;
	d.innerHTML = t;
	return d.firstElementChild as SVGSVGElement;
};

class OnscreenPad extends Component implements EventListenerObject {
	public static readonly tagName = "wf-onscreen-pad";
	private _base: SVGSVGElement = r(BaseSVG);
	private _input: InputMask = InputMask.None;
	private _label: HTMLElement = (<div style="position: absolute; top: 0px; left: 0px; font-size: .9em" />);
	private _label2: HTMLElement = (
		<div style="position: absolute; top: 0px; right: 0px; font-size: .9em; text-align: right;" />
	);
	private trackedTouch: number = null;

	public state: Storage = localStorage.prefixedWith("onscreeen");
	private offset: Point;
	private _lastInput: number;

	connectedCallback() {
		super.connectedCallback();
		this.applyState();

		this.positionThumb(0, 0);

		this.appendChild(this._base);
		this.appendChild(this._label);
		this.appendChild(this._label2);

		this.addEventListener("touchstart", this);
		this.addEventListener("touchmove", this);
		this.addEventListener("touchend", this);
		this.addEventListener("mousedown", this);
		this.addEventListener("zoom", this);
	}

	handleEvent(event: TouchEvent | MouseEvent): void {
		event.preventDefault();
		event.stopImmediatePropagation();

		if (event.type === "mousedown") {
			document.addEventListener("mouseup", this);
			document.addEventListener("mousemove", this);
		}

		if (event.type === "touchstart" && !this.trackedTouch) {
			this.trackedTouch = "changedTouches" in event ? event.changedTouches[0].identifier : null;
		}

		if (this.closest(".edit")) {
			if (event.type === "touchstart" || event.type === "mousedown") {
				const { clientX, clientY } = event instanceof MouseEvent ? event : event.touches[0];
				const { left, top } = this.getBoundingClientRect();
				this.offset = new Point(left - clientX, top - clientY);
				document.addEventListener("touchmove", this);
				document.addEventListener("mousemove", this);
				document.addEventListener("touchmove", this);
				document.addEventListener("mouseup", this);
				document.addEventListener("touchend", this);
			} else if (event.type === "mouseup" || event.type === "touchend") {
				this.offset = null;
				document.removeEventListener("mousemove", this);
				document.removeEventListener("touchmove", this);
				document.removeEventListener("mouseup", this);
				document.removeEventListener("touchend", this);

				const { top, left, bottom, right } = this.getBoundingClientRect();
				const {
					top: pTop,
					left: pLeft,
					bottom: pBottom,
					right: pRight,
					width,
					height
				} = this.closest(".edit").getBoundingClientRect();

				const le = (left - pLeft) / width;
				const ri = (pRight - right) / width;

				const bo = (pBottom - bottom) / height;
				const to = (top - pTop) / height;

				this.style.left = le < ri ? `${le * 100}%` : ``;
				this.style.right = ri < le ? `${ri * 100}%` : ``;
				this.style.bottom = bo < to ? `${bo * 100}%` : ``;
				this.style.top = to < bo ? `${to * 100}%` : ``;

				this.storeState();
			} else {
				const { clientX, clientY } = event instanceof MouseEvent ? event : event.touches[0];

				this.style.left = `${this.offset.x + clientX}px`;
				this.style.top = `${this.offset.y + clientY}px`;
				this.style.right = "";
				this.style.bottom = "";
			}
		}

		if (event.type === "touchend" || event.type === "mouseup") {
			if (
				"changedTouches" in event &&
				!Array.from(event.changedTouches).find(({ identifier }) => identifier === this.trackedTouch)
			)
				return;

			this.positionThumb(0, 0);
			this.trackedTouch = null;
			document.removeEventListener("mouseup", this);
			document.removeEventListener("mousemove", this);
		} else {
			const touches = "changedTouches" in event ? Array.from(event.changedTouches) : [];
			let touch: Touch | MouseEvent = touches.find(
				({ identifier }) => identifier === this.trackedTouch
			);
			if (!touch && event.type === "touchmove") return;
			if (!touch) touch = event as MouseEvent;

			const box = this.getBoundingClientRect();
			const centerX = box.left + box.width / 2;
			const centerY = box.top + box.height / 2;

			const x = (touch.clientX - centerX) / 80;
			const y = (touch.clientY - centerY) / 80;

			this.positionThumb(x, y);
		}
	}

	private positionThumb(x: number, y: number) {
		const ANGLE_RANGE = 55;
		const DEADZONE = 0.1;
		const DEADZONE_WALK = 0.4;

		x = max(min(x, 1), -1);
		y = max(min(y, 1), -1);

		let input: InputMask = InputMask.None;
		const [rho, theta] = xy2polar(x, y);
		const wrap = (input: number) => (360 + input) % 360;
		const angle = wrap(rad2deg(theta)) % 360;
		if (rho > DEADZONE && (angle.isInRange(0, ANGLE_RANGE) || angle.isInRange(360 - ANGLE_RANGE, 360)))
			input |= InputMask.Right;
		if (rho > DEADZONE && angle.isInRange(180 - ANGLE_RANGE, 180 + ANGLE_RANGE)) input |= InputMask.Left;
		if (rho > DEADZONE && angle.isInRange(90 - ANGLE_RANGE, 90 + ANGLE_RANGE)) input |= InputMask.Up;
		if (rho > DEADZONE && angle.isInRange(270 - ANGLE_RANGE, 270 + ANGLE_RANGE)) input |= InputMask.Down;
		if (input !== InputMask.None && rho > DEADZONE_WALK) input |= InputMask.Walk;

		if (Settings.debug) {
			this._label.textContent = `${x} x ${y}`;
			this._label2.textContent = `${(rho * 100).toPrecision(3)}% @ ${angle.toPrecision(2)}°`;
		}

		this._input = input;
		this._lastInput = performance.now();
	}

	disconnectedCallback() {
		this.removeEventListener("touchstart", this);
		this.removeEventListener("touchmove", this);
		this.removeEventListener("touchend", this);
		this.removeEventListener("mousedown", this);
		this.removeEventListener("zoom", this);
		document.removeEventListener("mousemove", this);
		document.removeEventListener("mouseup", this);

		super.disconnectedCallback();
	}

	private applyState() {
		const { top, left, bottom, right } = this.state.load(this.id) || {};
		this.style.top = top;
		this.style.left = left;
		this.style.bottom = bottom;
		this.style.right = right;
	}

	private storeState() {
		const { top, left, bottom, right } = this.style;
		this.state.store(this.id, { top, left, bottom, right });
	}

	public get input(): InputMask {
		return this._input;
	}

	public get lastInput(): number {
		return this._lastInput;
	}
}

export default OnscreenPad;
