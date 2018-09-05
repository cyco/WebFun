import { document } from "src/std.dom";
import { dispatch } from "src/util";
import Component from "../component";
import "./slider.scss";

class Slider extends Component {
	private _value = 0;
	private _min = 0;
	private _max = 0;
	private _steps = 0;
	private _snapToIntegers = false;
	private _continuous = false;
	private _onChange: Function = null;
	private _knob: HTMLDivElement;
	private _left: HTMLDivElement;
	private _right: HTMLDivElement;
	private _minText: string;
	private _midText: string;
	private _maxText: string;

	static get tagName() {
		return "wf-slider";
	}

	get min() {
		return this._min;
	}

	set min(v) {
		this._min = v;
		this.layout();
	}

	get value() {
		return this._value;
	}

	set value(v) {
		this._value = Math.max(this._min, Math.min(v, this._max));
		this.layout();
	}

	get max() {
		return this._max;
	}

	set max(v) {
		this._max = v;
		this.layout();
	}

	get minText() {
		return this._minText;
	}

	set minText(t) {
		this._minText = t;
	}

	get midText() {
		return this._midText;
	}

	set midText(t) {
		this._midText = t;
	}

	get maxText() {
		return this._maxText;
	}

	set maxText(t) {
		this._maxText = t;
	}

	get continuous() {
		return this._continuous;
	}

	set continuous(c) {
		this._continuous = c;
	}

	get onChange() {
		return this._onChange;
	}

	set onChange(fn) {
		this._onChange = fn;
	}

	get snapToIntegers() {
		return this._snapToIntegers;
	}

	set snapToIntegers(s) {
		this._snapToIntegers = s;
	}

	get steps() {
		return this._steps;
	}

	set steps(s) {
		this._steps = s;
	}

	protected connectedCallback() {
		super.connectedCallback();

		this._setupLeftButton();
		this._setupThumb();
		this._setupRightButton();

		this.layout();
	}

	private _setupThumb() {
		this._knob = this._makeButton();
		this._knob.classList.add("thumb");
		this.appendChild(this._knob);

		let mouseCoordinates = {
			x: 0,
			y: 0
		};
		let buttonCoordinates = {
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
			let difX = e.pageX - mouseCoordinates.x;
			let _ = e.pageY - mouseCoordinates.y;

			const buttonWidth = 16;
			const width = this.getBoundingClientRect().width - 2 * buttonWidth;
			let pos = buttonCoordinates.x + difX;

			pos = Math.max(buttonWidth, pos);
			pos = Math.min(width, pos);

			this._knob.style.left = pos + "px";

			this._value =
				this._min +
				((pos - buttonWidth) / (this.getBoundingClientRect().width - 3 * buttonWidth)) *
					(this._max - this._min);
			if (this._snapToIntegers) {
				this._value = Math.round(this._value);
			}

			this._value = Math.max(this._min, this._value);
			this._value = Math.min(this._max, this._value);

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

	private _setupLeftButton() {
		this._left = this._makeButton();
		this._left.classList.add("left");
		this._left.onmousedown = () => {
			this._left.classList.add("active");
			this._tickLeft();
		};
		this._left.onmouseup = () => {
			this._left.classList.remove("active");
		};

		this.appendChild(this._left);
	}

	private _setupRightButton() {
		this._right = this._makeButton();
		this._right.classList.add("right");
		this._right.onmousedown = () => {
			this._right.classList.add("active");
			this._tickRight();
		};
		this._right.onmouseup = () => {
			this._right.classList.remove("active");
		};

		this.appendChild(this._right);
	}

	private _makeButton() {
		const button = document.createElement("div");
		button.classList.add("knob");

		const inside = document.createElement("div");
		button.appendChild(inside);

		return button;
	}

	private _tickLeft() {
		const tickWidth = this._snapToIntegers ? 1 : 0.02;
		this.value -= tickWidth;

		dispatch(() => {
			if (this._left.classList.contains("active")) this._tickLeft();
		}, 80);
	}

	private _tickRight() {
		const tickWidth = this._snapToIntegers ? 1 : 0.02;
		this.value += tickWidth;

		dispatch(() => {
			if (this._right.classList.contains("active")) this._tickRight();
		}, 80);
	}

	layout() {
		this._value = Math.max(this._min, this._value);
		this._value = Math.min(this._max, this._value);

		if (!this.isConnected) return;

		const relativeValue = (this._value - this._min) / (this._max - this._min);
		const knobWidth = 16;
		const width = this.getBoundingClientRect().width - 3 * knobWidth;
		this._knob.style.left = knobWidth + width * relativeValue + "px";
	}

	private _postChangeNotification() {
		if (this._onChange instanceof Function) {
			this._onChange(this);
		}
	}
}

export default Slider;
