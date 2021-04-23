import "./slider.scss";

import Component from "../component";
import { clamp, px } from "src/util";
import { max, min, round } from "src/std/math";

const leftButtonWidth = 18;
const rightButtonWidth = 20;
const knobWidth = 18;
const RepeatDelay = 80;

class Slider extends Component implements EventListenerObject {
	public static readonly tagName = "wf-slider";

	private _value = 0;
	private _min = 0;
	private _max = 0;
	private _steps = 0;
	private _snapToIntegers = false;
	private _continuous = false;
	private _onChange: (_: Event) => void = null;
	private _repeat: number = null;
	private _knob: HTMLDivElement = (
		<div className="knob thumb">
			<div></div>
		</div>
	);
	private _left: HTMLDivElement = (
		<div className="knob left">
			<div></div>
		</div>
	);
	private _right: HTMLDivElement = (
		<div className="knob right">
			<div></div>
		</div>
	);

	private _minText: string;
	private _midText: string;
	private _maxText: string;

	get min(): number {
		return this._min;
	}

	set min(v: number) {
		this._min = v;
		this.layout();
	}

	get value(): number {
		return this._value;
	}

	set value(v: number) {
		this._value = clamp(this._min, v, this._max);
		this.layout();
	}

	get max(): number {
		return this._max;
	}

	set max(v: number) {
		this._max = v;
		this.layout();
	}

	get minText(): string {
		return this._minText;
	}

	set minText(t: string) {
		this._minText = t;
	}

	get midText(): string {
		return this._midText;
	}

	set midText(t: string) {
		this._midText = t;
	}

	get maxText(): string {
		return this._maxText;
	}

	set maxText(t: string) {
		this._maxText = t;
	}

	get continuous(): boolean {
		return this._continuous;
	}

	set continuous(c: boolean) {
		this._continuous = c;
	}

	get onChange(): (_: Event) => void {
		return this._onChange;
	}

	set onChange(fn: (_: Event) => void) {
		this._onChange = fn;
	}

	get snapToIntegers(): boolean {
		return this._snapToIntegers;
	}

	set snapToIntegers(s: boolean) {
		this._snapToIntegers = s;
	}

	get steps(): number {
		return this._steps;
	}

	set steps(s: number) {
		this._steps = s;
	}

	protected connectedCallback(): void {
		super.connectedCallback();

		this._right.addEventListener("mousedown", this);
		this._left.addEventListener("mousedown", this);

		this.appendChild(this._right);
		this.appendChild(this._left);
		this._setupThumb();

		this.layout();
	}

	protected disconnectedCallback(): void {
		this._right.removeEventListener("mousedown", this);
		this._left.removeEventListener("mousedown", this);
		document.removeEventListener("mouseup", this);

		super.disconnectedCallback();
	}

	handleEvent(event: Event): void {
		const { type, currentTarget } = event;

		if (type === "mousedown" && currentTarget === this._left) {
			this._tickLeft();
			document.addEventListener("mouseup", this);
		}

		if (type === "mousedown" && currentTarget === this._right) {
			this._tickRight();
			document.addEventListener("mouseup", this);
		}

		if (type === "mouseup") {
			document.removeEventListener("mouseup", this);
			clearTimeout(this._repeat);
		}
	}

	private _setupThumb() {
		this.appendChild(this._knob);

		const mouseCoordinates = {
			x: 0,
			y: 0
		};
		const buttonCoordinates = {
			x: 0,
			y: 0
		};
		const mouseDown = (e: MouseEvent) => {
			mouseCoordinates.x = e.pageX;
			mouseCoordinates.y = e.pageY;

			buttonCoordinates.x = parseInt(this._knob.style.left);
			buttonCoordinates.y = parseInt(this._knob.style.top);

			window.addEventListener("mouseup", mouseUp);
			window.addEventListener("mousemove", mouseMove);
		};

		const mouseMove = (e: MouseEvent) => {
			const difX = e.pageX - mouseCoordinates.x;

			let pos = buttonCoordinates.x + difX;
			const sliderLength = this.sliderLength;

			pos = max(leftButtonWidth, pos);
			pos = min(leftButtonWidth + sliderLength, pos);

			this._value = this._min + ((pos - leftButtonWidth) / sliderLength) * (this._max - this._min);

			if (this._snapToIntegers) {
				this._value = round(this._value);
			}

			this.layout();

			if (this.continuous) this._postChangeNotification();
		};

		const mouseUp = () => {
			window.removeEventListener("mousemove", mouseMove);
			window.removeEventListener("mouseup", mouseUp);

			if (this._snapToIntegers) {
				this.layout();
			}

			this._postChangeNotification();
		};

		this._knob.addEventListener("mousedown", mouseDown);
	}

	private _tickLeft() {
		const tickWidth = this._snapToIntegers ? 1 : 0.02;
		this.value -= tickWidth;

		if (this._repeat) clearTimeout(this._repeat);
		this._repeat = setTimeout(() => this._tickLeft(), RepeatDelay);
	}

	private _tickRight() {
		const tickWidth = this._snapToIntegers ? 1 : 0.02;
		this.value += tickWidth;

		if (this._repeat) clearTimeout(this._repeat);
		this._repeat = setTimeout(() => this._tickRight(), RepeatDelay);
	}

	private layout(): void {
		if (!this.isConnected) return;

		const relativeValue = (this._value - this._min) / (this._max - this._min);
		this._knob.style.left = px(round(leftButtonWidth + this.sliderLength * relativeValue));
	}

	private get sliderLength(): number {
		return this.getBoundingClientRect().width - leftButtonWidth - knobWidth - rightButtonWidth;
	}

	private _postChangeNotification() {
		if (this._onChange instanceof Function) {
			this._onChange(new CustomEvent("change"));
		}
	}
}

export default Slider;
