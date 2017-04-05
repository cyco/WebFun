import View from "./view";
export default class Slider extends View {
	constructor() {
		super();

		this.element.classList.add("Slider");

		this._value = 0;
		this._minValue = 0;
		this._maxValue = 0;
		this._stepSize = 0.01;

		this._snapToIntegers = false;
		this._continuous = false;
		this._onChange = null;

		this._setupLeftButton();
		this._setupThumb();
		this._setupRightButton();
	}

	_setupThumb() {
		this._knob = this._makeButton();
		this._knob.classList.add("thumb");
		this.element.appendChild(this._knob);

		const self = this;

		let mouseCoordinates = {
			x: 0,
			y: 0
		};
		let buttonCoordinates = {
			x: 0,
			y: 0
		};
		const mouseDown = (e) => {
			mouseCoordinates.x = e.pageX;
			mouseCoordinates.y = e.pageY;

			buttonCoordinates.x = parseInt(self._knob.style.left);
			buttonCoordinates.y = parseInt(self._knob.style.top);

			window.addEventListener("mouseup", mouseUp);
			window.addEventListener("mousemove", mouseMove);
		};

		const mouseMove = (e) => {
			let difX = e.pageX - mouseCoordinates.x;
			let difY = e.pageY - mouseCoordinates.y;

			const buttonWidth = 16;
			const width = this.element.getBoundingClientRect().width - 2 * buttonWidth;
			let pos = buttonCoordinates.x + difX;

			pos = Math.max(buttonWidth, pos);
			pos = Math.min(width, pos);

			self._knob.style.left = pos + "px";

			this._value = this._minValue + (pos - buttonWidth) / (this.element.getBoundingClientRect().width - 3 * buttonWidth) * (this._maxValue - this.minValue);
			if (this._snapToIntegers) {
				this._value = Math.round(this._value);
			}

			this._value = Math.max(this._minValue, this._value);
			this._value = Math.min(this._maxValue, this._value);

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

	_setupLeftButton() {
		const self = this;

		this._left = this._makeButton();
		this._left.classList.add("left");
		this._left.onmousedown = () => {
			self._left.classList.add("active");
			self._tickLeft();
		};
		this._left.onmouseup = () => {
			self._left.classList.remove("active");
		};

		this.element.appendChild(this._left);
	}

	_setupRightButton() {
		const self = this;

		this._right = this._makeButton();
		this._right.classList.add("right");
		this._right.onmousedown = () => {
			self._right.classList.add("active");
			self._tickRight();
		};
		this._right.onmouseup = () => {
			self._right.classList.remove("active");
		};

		this.element.appendChild(this._right);
	}

	_makeButton() {
		const button = document.createElement("div");
		button.classList.add("knob");

		const inside = document.createElement("div");
		button.appendChild(inside);

		return button;
	}

	_tickLeft() {
		const tickWidth = this._snapToIntegers ? 1 : 0.02;

		this.value -= tickWidth;
		const self = this;
		dispatch(() => {
			if (this._left.classList.contains("active"))
				self._tickLeft();
		}, 80);
	}

	_tickRight() {
		const tickWidth = this._snapToIntegers ? 1 : 0.02;

		this.value += tickWidth;
		const self = this;
		dispatch(() => {
			if (this._right.classList.contains("active"))
				self._tickRight();
		}, 80);
	}

	layout() {
		this._value = Math.max(this._minValue, this._value);
		this._value = Math.min(this._maxValue, this._value);

		const relativeValue = (this._value - this._minValue) / (this._maxValue - this._minValue);
		const knobWidth = 16;
		const width = this.element.getBoundingClientRect().width - 3 * knobWidth;
		this._knob.style.left = (knobWidth + width * relativeValue) + "px";
	}

	_postChangeNotification() {
		if (typeof this._onChange === "function") {
			this._onChange(this);
		}
	}

	get minValue() {
		return this._minValue;
	}
	set minValue(v) {
		this._minValue = v;
		this.layout();
	}

	set value(v) {
		this._value = Math.max(this._minValue, Math.min(v, this._maxValue));
		this.layout();
	}
	get value() {
		return this._value;
	}

	get maxValue() {
		return this._maxValue;
	}
	set maxValue(v) {
		this._maxValue = v;
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

	set stepSize(s) {
		this._stepSize = s;
	}
	get stepSize() {
		return this._StepSize;
	}

	set continuous(c) {
		this._continuous = c;
	}

	get continuous() {
		return this._continuous;
	}

	set onChange(fn) {
		this._onChange = fn;
	}

	get onChange() {
		return this._onChange;
	}

	set snapToIntegers(s) {
		this._snapToIntegers = s;
	}
	get snapToIntegers() {
		return this._snapToIntegers;
	}
}
;
