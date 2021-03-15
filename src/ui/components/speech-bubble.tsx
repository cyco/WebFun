import "./speech-bubble.scss";

import Button from "./button";
import Component from "../component";
import { Point } from "src/util";

export const Event = {
	End: "end"
};

const Padding = 7;
const MaxLineCount = 5;
const ArrowWidth = 16;
const ScrollRepeatInterval = 100;

const MODIFIED = 1;
enum ArrowStyle {
	None = 1 << 5,

	Top = 1 << 1,
	Bottom = 1 << 2,

	Left = 1 << 3,
	Right = 1 << 4,

	Horizontal = ArrowStyle.Left | ArrowStyle.Right,
	Vertical = ArrowStyle.Top | ArrowStyle.Bottom
}

const DefaultTextStyle = {
	fontSize: "11px",
	fontFamily: `"Trueno", sans-serif`,
	lineHeight: "12px"
};

class SpeechBubble extends Component {
	public static readonly ArrowStyle = ArrowStyle;
	public static readonly Event = Event;
	public static readonly tagName = "wf-speech-bubble";

	public onend: (e: CustomEvent) => void;
	private _width = 170;
	private _arrowStyle = ArrowStyle.Top;
	private _up = (<Button className="up" icon="caret-up" onmousedown={() => this.scrollUp()} />);
	private _down = (
		<Button className="down" icon="caret-down" onmousedown={() => this.scrollDown()} />
	);
	private _end = (<Button className="end" icon="circle" onclick={() => this.end()} />);
	private _text: HTMLElement = (<div className="text" style={DefaultTextStyle} />);
	private _keepScrolling: number = -1;
	private _origin: Point = new Point(0, 0);

	constructor() {
		super();

		const textContainer = <div className="text-container"></div>;
		textContainer.appendChild(this._text);
	}

	protected connectedCallback(): void {
		super.connectedCallback();

		this.style.setProperty("--font-family", DefaultTextStyle.fontFamily);
		this.style.setProperty("--line-height", DefaultTextStyle.lineHeight);
		this.style.setProperty("--current-line", "0");

		this.style.width = this._width + "px";

		this.appendChild(this._text.parentNode);

		this.text = this.text || "";
	}

	private rebuild() {
		if (!this.isConnected) return;

		this.appendChild(this._text.parentNode);
		this._setupButtons();
		this._setupBackground();
		this._setupBackground();
		this._updateButtonVisibility();
		this._scrollTo(0);

		const p = this.origin;
		if (this._arrowStyle === ArrowStyle.Bottom) {
			p.y -= parseInt(this.style.height);
		}
		this.style.left = p.x - parseInt(this._width + "") / 2 + "px";
		this.style.top = p.y + "px";
	}

	get text(): string {
		return this._text.textContent;
	}

	set text(text: string) {
		this._text.textContent = text.replace(/(?:\r\n|\r|\n)/g, "\n");
		this.rebuild();
	}

	set origin(p: Point) {
		this._origin = p;
		this.rebuild();
	}

	get origin(): Point {
		return this._origin;
	}

	set arrowStyle(style: ArrowStyle) {
		this._arrowStyle = style;
		this.rebuild();
	}

	get arrowStyle(): ArrowStyle {
		return this._arrowStyle;
	}

	private _setupButtons() {
		this._end.setAttribute("disabled", "");
		this.appendChild(
			<div className="controls">
				{this._up}
				{this._down}
				{this._end}
			</div>
		);
	}

	private _setupBackground() {
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
		} else if (this._arrowStyle & ArrowStyle.None) {
			this.style.height = height + "px";
			this.style.width = width + "px";
			background.setAttribute("height", "" + height);
			background.setAttribute("width", `${width}`);
		}

		const leftArrowWidth = this._arrowStyle & ArrowStyle.Left ? ArrowWidth : 0;
		const rightArrowWidth = this._arrowStyle & ArrowStyle.Right ? ArrowWidth : 0;
		const topArrowWidth = this._arrowStyle & ArrowStyle.Top ? ArrowWidth : 0;
		const bottomArrowWidth = this._arrowStyle & ArrowStyle.Bottom ? ArrowWidth : 0;

		this._text.parentElement.style.left = Padding + leftArrowWidth + "px";
		this._text.parentElement.style.top = Padding + topArrowWidth + "px";
		this._text.parentElement.style.bottom = Padding + bottomArrowWidth + "px";
		this._text.parentElement.style.right = 21 + Padding + rightArrowWidth + "px";

		this._end.parentElement.style.bottom = Padding - 2 + bottomArrowWidth + "px";
	}

	private _buildPath() {
		const width = this._width;
		const height = this._calculateHeight();
		const b = 5;

		const top = this._arrowStyle & ArrowStyle.Top ? 0 + ArrowWidth : 0;
		const left = this._arrowStyle & ArrowStyle.Right ? 0 + ArrowWidth : 0;
		const bottom = top + height;
		const right = left + width;

		const path = [];

		path.push(["M", left + b, top]);
		if (this._arrowStyle & ArrowStyle.Top) {
			const arrowLeft = !!(this._arrowStyle & MODIFIED);
			const arrowStart = (right - left) / 2 - ArrowWidth / 2 - ArrowWidth / 2.0;
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
			const arrowStart = (right - left) / 2 - ArrowWidth / 2 - ArrowWidth / 2.0;
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

	public scrollDown(): void {
		this._scrollBy(1);
		this._keepScrolling = setTimeout(() => this.scrollDown(), ScrollRepeatInterval);
		this.stopScrollingOnMouseUp();
	}

	public scrollUp(): void {
		this._scrollBy(-1);
		this._keepScrolling = setTimeout(() => this.scrollUp(), ScrollRepeatInterval);
		this.stopScrollingOnMouseUp();
	}

	public end(): void {
		clearTimeout(this._keepScrolling);
		this.remove();
		this.dispatchEvent(new CustomEvent(SpeechBubble.Event.End));
		if (this.onend) this.onend(new CustomEvent(SpeechBubble.Event.End));
	}

	private stopScrollingOnMouseUp() {
		document.addEventListener("mouseup", () => clearTimeout(this._keepScrolling), {
			capture: true,
			passive: true,
			once: true
		});
	}

	public show(container: HTMLElement = document.body): void {
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

		return Padding + lineCount * parseInt(DefaultTextStyle.lineHeight) + Padding;
	}

	private _calculateNumberOfLines(skipClipping: boolean): number {
		const lineCount = Math.ceil(
			this._text.getBoundingClientRect().height / parseInt(DefaultTextStyle.lineHeight)
		);
		const line = Math.max(1, lineCount);

		if (skipClipping) return line;
		return Math.min(line, 5);
	}

	private _updateButtonVisibility() {
		const canScroll = this._calculateNumberOfLines(true) > 5;
		if (!canScroll) {
			this._up.setAttribute("hidden", "");
			this._down.setAttribute("hidden", "");
		} else {
			this._up.removeAttribute("hidden");
			this._down.removeAttribute("hidden");
		}
	}

	private _updateButtonStates() {
		const currentLine = parseInt(this._text.style.getPropertyValue("--current-line"));
		const maxLine = this._calculateNumberOfLines(true) - MaxLineCount;

		this._up.removeAttribute("disabled");
		this._down.removeAttribute("disabled");

		if (currentLine <= 0) {
			this._up.setAttribute("disabled", "");
		}

		if (currentLine >= maxLine) {
			this._down.setAttribute("disabled", "");
			this._end.removeAttribute("disabled");
		}
	}
}

export default SpeechBubble;
