import Button from "./button";
import { dispatch, Point } from "src/util";
import "./speech-bubble.scss";
import Component from "../component";

export const Event = {
	End: "end"
};

const FontSize = "11px";
const LineHeight = "12px";
const FontFamily = "Microsoft Sans Serif,sans";
const Padding = "7px";
const MaxLineCount = 5;
const ArrowWidth = 16;
const ScrollRepeatInterval = 100;

const MODIFIED = 1;
const enum ArrowStyle {
	Top = 1 << 1,
	Bottom = 1 << 2,

	Left = 1 << 3,
	Right = 1 << 4,

	Horizontal = ArrowStyle.Left | ArrowStyle.Right,
	Vertical = ArrowStyle.Top | ArrowStyle.Left
}

class SpeechBubble extends Component {
	public static readonly tagName = "wf-speech-bubble";
	public static readonly Event = Event;
	public static readonly observedAttributes = ["text"];

	public onend: (e: CustomEvent) => void;
	private _width: number = 170;
	private _arrowStyle: number = ArrowStyle.Top;
	private _upButton: Button;
	private _downButton: Button;
	private _endButton: Button;
	private _text: HTMLElement;
	private _keepScrolling: number;

	constructor() {
		super();

		this._text = document.createElement("div");
		this._text.style.fontSize = FontSize;
		this._text.style.fontFamily = FontFamily;
		this._text.style.lineHeight = LineHeight;
		this._text.classList.add("text");

		const textContainer = document.createElement("div");
		textContainer.classList.add("text-container");
		textContainer.appendChild(this._text);

		this._upButton = this._buildButton("up", "caret-up");
		this._upButton.onmousedown = () => {
			this.scrollUp();

			document.addEventListener("mouseup", () => clearTimeout(this._keepScrolling), {
				capture: true,
				passive: true,
				once: true
			});
		};
		this._downButton = this._buildButton("down", "caret-down");
		this._downButton.onmousedown = () => {
			this.scrollDown();

			document.addEventListener("mouseup", () => clearTimeout(this._keepScrolling), {
				capture: true,
				passive: true,
				once: true
			});
		};

		this._endButton = this._buildButton("end", "circle");
		this._endButton.onclick = () => this.end();
	}

	protected connectedCallback() {
		super.connectedCallback();

		this.style.setProperty("--font-family", FontFamily);
		this.style.setProperty("--line-height", LineHeight);
		this.style.setProperty("--current-line", "0");

		this.style.width = this._width + "px";
		this.style.position = "absolute";

		this.appendChild(this._text.parentNode);

		this.text = this.text || "";
	}

	protected attributeChangedCallback(attribute: string, oldValue: string, newValue: string): void {
		this.text = newValue;
	}

	get text() {
		return this._text.textContent;
	}

	set text(t) {
		this._text.textContent = t;

		if (!this.isConnected) return;

		this.appendChild(this._text.parentNode);
		this._setupButtons();
		this._setupBackground();
		this._udpateButtonVisibility();
		this._scrollTo(0);
	}

	set origin(p: Point) {
		this.style.left = p.x - parseInt(this._width + "") / 2 + "px";
		this.style.top = p.x + "px";
	}

	get origin(): Point {
		return new Point(parseInt(this.style.left), parseInt(this.style.top));
	}

	private _buildButton(className: string, icon: string): Button {
		const button = <Button>document.createElement(Button.tagName);
		button.classList.add(className);
		button.icon = icon;
		return button;
	}

	_setupButtons() {
		this._endButton.setAttribute("disabled", "");

		const buttonBar = document.createElement("div");
		buttonBar.classList.add("controls");
		buttonBar.appendChild(this._upButton);
		buttonBar.appendChild(this._downButton);
		buttonBar.appendChild(this._endButton);
		this.appendChild(buttonBar);
	}

	_setupBackground() {
		const previousBackground = this.querySelector("svg");
		if (previousBackground) previousBackground.remove();

		const numberOfLines = this._calculateNumberOfLines(false);
		if (numberOfLines === 1) this.classList.add("singleline");
		else this.classList.remove("singleline");

		const width = this._width;
		const height = this._calculateHeight();

		const ns = "http://www.w3.org/2000/svg";
		const background = document.createElementNS(ns, "svg");

		const p = document.createElementNS(ns, "path");
		p.style.fill = "#FFFFFF";
		p.style.stroke = "#000000";
		p.setAttribute("d", this._buildPath());
		background.appendChild(p);

		this.insertBefore(background, this.firstChild);

		if (this._arrowStyle & ArrowStyle.Vertical) {
			this.style.height = height + ArrowWidth + "px";
			this.style.width = width + "px";
			background.setAttribute("height", `${height + ArrowWidth}`);
			background.setAttribute("width", "" + width);
		} else if (this._arrowStyle & ArrowStyle.Horizontal) {
			this.style.height = height + "px";
			this.style.width = width + ArrowWidth + "px";
			background.setAttribute("height", "" + height);
			background.setAttribute("width", `${width + ArrowWidth}`);
		}

		const leftArrowWidth = this._arrowStyle & ArrowStyle.Left ? ArrowWidth : 0;
		const rightArrowWidth = this._arrowStyle & ArrowStyle.Right ? ArrowWidth : 0;
		const topArrowWidth = this._arrowStyle & ArrowStyle.Top ? ArrowWidth : 0;
		const bottomArrowWidth = this._arrowStyle & ArrowStyle.Bottom ? ArrowWidth : 0;

		const padding = parseInt(Padding);
		this._text.parentElement.style.left = padding + leftArrowWidth + "px";
		this._text.parentElement.style.top = padding + topArrowWidth + "px";
		this._text.parentElement.style.bottom = padding + bottomArrowWidth + "px";
		this._text.parentElement.style.right = 21 + padding + rightArrowWidth + "px";

		this._endButton.parentElement.style.bottom = padding - 2 + bottomArrowWidth + "px";
	}

	_buildPath() {
		const width = this._width;
		const height = this._calculateHeight();
		const b = 5;

		const top = this._arrowStyle & ArrowStyle.Top ? 0 + ArrowWidth : 0;
		const left = this._arrowStyle & ArrowStyle.Right ? 0 + ArrowWidth : 0;
		const bottom = top + height;
		const right = left + width;

		let path = [];

		path.push(["M", left + b, top]);
		if (this._arrowStyle & ArrowStyle.Top) {
			const arrowLeft = !!(this._arrowStyle & MODIFIED);
			const arrowStart = (right - left) / 2 - ArrowWidth / 2;
			const arrowTipX = arrowLeft ? arrowStart : arrowStart + ArrowWidth;

			path.push(["L", arrowStart, top]);
			path.push(["L", arrowTipX, top - ArrowWidth]);
			path.push(["L", arrowStart + ArrowWidth, top]);
		}

		path.push(["L", right - b, top]);
		path.push(["A", b, b, 0, 0, 1, right, top + b]);
		path.push(["L", right, bottom - b]);
		path.push(["A", b, b, 0, 0, 1, width - b, bottom]);
		if (this._arrowStyle & ArrowStyle.Bottom) {
			const arrowStart = (right - left) / 2 - ArrowWidth / 2;
			const arrowLeft = !!(this._arrowStyle & MODIFIED);
			const arrowTipX = arrowLeft ? arrowStart : arrowStart + ArrowWidth;

			path.push(["L", arrowStart + ArrowWidth, height]);
			path.push(["L", arrowTipX, bottom + ArrowWidth]);
			path.push(["L", arrowStart, bottom]);
		}
		path.push(["L", left + b, bottom]);
		path.push(["A", b, b, 0, 0, 1, left, bottom - b]);
		path.push(["L", left, top + b]);
		path.push(["A", b, b, 0, 0, 1, left + b, top]);
		path.push(["Z"]);

		return path.map(([first, ...rest]) => first + rest.join(",")).join(" ");
	}

	public scrollDown() {
		this._scrollBy(1);
		this._keepScrolling = setTimeout(() => this.scrollDown(), ScrollRepeatInterval);
	}

	public scrollUp() {
		this._scrollBy(-1);
		this._keepScrolling = setTimeout(() => this.scrollUp(), ScrollRepeatInterval);
	}

	public end() {
		clearTimeout(this._keepScrolling);
		this.remove();
		this.dispatchEvent(new CustomEvent(SpeechBubble.Event.End));
		if (this.onend) this.onend(new CustomEvent(SpeechBubble.Event.End));
	}

	public show(container: HTMLElement = document.body) {
		container.appendChild(this);
	}

	private _scrollBy(l: number): void {
		const currentScroll = parseInt(this._text.style.getPropertyValue("--current-line")) | 0;
		this._scrollTo(currentScroll + l);
	}

	private _scrollTo(line: number = 0) {
		const totalLineCount = this._calculateNumberOfLines(true);

		line = Math.min(line, totalLineCount - MaxLineCount);
		line = Math.max(line, 0);

		this._text.style.setProperty("--current-line", `${line}`);
		this._updateButtonStates();
	}

	private _calculateHeight() {
		const lineCount = this._calculateNumberOfLines(false);

		const padding = parseInt(Padding);
		return padding + lineCount * parseInt(LineHeight) + padding;
	}

	private _calculateNumberOfLines(skipClipping: boolean): number {
		const lineCount = Math.ceil(this._text.getBoundingClientRect().height / parseInt(LineHeight));
		let line = Math.max(1, lineCount);

		if (skipClipping) return line;
		return Math.min(line, 5);
	}

	private _udpateButtonVisibility() {
		const canScroll = this._calculateNumberOfLines(true) > 5;
		if (!canScroll) {
			this._upButton.setAttribute("hidden", "");
			this._downButton.setAttribute("hidden", "");
		} else {
			this._upButton.removeAttribute("hidden");
			this._downButton.removeAttribute("hidden");
		}
	}

	private _updateButtonStates() {
		const currentLine = parseInt(this._text.style.getPropertyValue("--current-line"));
		const maxLine = this._calculateNumberOfLines(true) - MaxLineCount;

		this._upButton.removeAttribute("disabled");
		this._downButton.removeAttribute("disabled");

		if (currentLine <= 0) {
			this._upButton.setAttribute("disabled", "");
		}

		if (currentLine >= maxLine) {
			this._downButton.setAttribute("disabled", "");
			this._endButton.removeAttribute("disabled");
		}
	}
}

export default SpeechBubble;
