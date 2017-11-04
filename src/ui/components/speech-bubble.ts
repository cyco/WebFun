import { IconButton } from "src/ui/components";
import { dispatch } from "src/util";
import "./speech-bubble.scss";
import Component from "../component";

export const Event = {
	End: "end"
};

declare global {
	interface HTMLElement {
		append(_: string): void;
	}
}

class SpeechBubble extends Component {
	public static readonly TagName = "wf-speech-bubble";
	public static readonly Event = Event;
	public static readonly ARROW_STYLE = {
		MODIFIED: 1,

		BOTTOM: 2,
		LEFT: 4,
		RIGHT: 6,
		TOP: 8
	};

	public onend: (e: CustomEvent) => void;
	private _lineHeight: number = 16;
	private _maxNumberOfLines: number = 5;
	private _border: number = 5;
	private _width: number = 170;
	private _arrowWidth: number = 16;
	private _arrowStyle: number = SpeechBubble.ARROW_STYLE.TOP;
	private _upButton: IconButton;
	private _downButton: IconButton;
	private _endButton: IconButton;
	private _text = document.createElement("div");

	connectedCallback() {
		super.connectedCallback();

		this.style.width = this._width + "px";
		this.style.position = "absolute";

		this.classList.add("speech-bubble");

		const textContainer = document.createElement("div");
		textContainer.classList.add("text-container");

		this._text.classList.add("text");
		textContainer.appendChild(this._text);

		this.appendChild(textContainer);
		this._setupButtons();
	}

	get text() {
		return this._text.textContent;
	}

	set text(t) {
		this._text.textContent = "";

		const lines = t.split("\n");
		lines.forEach((line) => {
			this._text.append(line.replace("/\r//", ""));
			this._text.appendChild(document.createElement("br"));
		});

		dispatch(() => {
			this._setupBackground();
			this._scrollTo(0);
		});
	}

	get x() {
		return parseInt(this.style.left);
	}

	set x(v) {
		this.style.left = (v - parseInt(this._width + "") / 2) + "px";
	}

	get y() {
		return parseInt(this.style.top);
	}

	set y(v) {
		this.style.top = v + "px";
	}

	_setupButtons() {
		const buttonBar = document.createElement("div");
		buttonBar.classList.add("controls");

		const up = <IconButton>document.createElement(IconButton.TagName);
		up.classList.add("bordered");
		up.classList.add("up");
		up.onclick = () => this.scrollUp();
		up.icon = "caret-up";
		buttonBar.appendChild(up);
		this._upButton = up;

		const down = <IconButton>document.createElement(IconButton.TagName);
		down.classList.add("bordered");
		down.classList.add("down");
		down.onclick = () => this.scrollDown();
		down.icon = "caret-down";
		buttonBar.appendChild(down);
		this._downButton = down;

		const end = <IconButton>document.createElement(IconButton.TagName);
		end.classList.add("bordered");
		end.classList.add("end");
		end.onclick = () => this.end();
		end.icon = "circle";
		buttonBar.appendChild(end);
		this._endButton = end;

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
		const arrowWidth = this._arrowWidth;

		const ns = "http://www.w3.org/2000/svg";
		const background = document.createElementNS(ns, "svg");

		const p = document.createElementNS(ns, "path");
		p.style.fill = "#FFFFFF";
		p.style.stroke = "#000000";
		p.setAttribute("d", this._buildPath());
		background.appendChild(p);

		this.insertBefore(background, this.firstChild);

		if (this._arrowStyle & SpeechBubble.ARROW_STYLE.TOP ||
			this._arrowStyle & SpeechBubble.ARROW_STYLE.BOTTOM) {
			this.style.height = height + arrowWidth + "px";
			this.style.width = width + "px";
			background.setAttribute("height", "" + height + arrowWidth);
			background.setAttribute("width", "" + width);

		} else if (this._arrowStyle & SpeechBubble.ARROW_STYLE.LEFT ||
			this._arrowStyle & SpeechBubble.ARROW_STYLE.RIGHT) {
			this.style.height = height + "px";
			this.style.width = width + arrowWidth + "px";
			background.setAttribute("height", "" + height);
			background.setAttribute("width", "" + width + arrowWidth);
		}

		const leftArrowWidth = (this._arrowStyle & SpeechBubble.ARROW_STYLE.LEFT ? arrowWidth : 0);
		const rightArrowWidth = (this._arrowStyle & SpeechBubble.ARROW_STYLE.RIGHT ? arrowWidth : 0);
		const topArrowWidth = (this._arrowStyle & SpeechBubble.ARROW_STYLE.TOP ? arrowWidth : 0);
		const bottomArrowWidth = (this._arrowStyle & SpeechBubble.ARROW_STYLE.BOTTOM ? arrowWidth : 0);
		this._text.parentElement.style.left = 5 + leftArrowWidth + "px";
		this._text.parentElement.style.top = 5 + topArrowWidth + "px";
		this._text.parentElement.style.bottom = 5 + bottomArrowWidth + "px";
		this._text.parentElement.style.right = 21 + 5 + rightArrowWidth + "px";

		this._endButton.parentElement.style.bottom = 5 + bottomArrowWidth + "px";
	}

	_buildPath() {
		const width = this._width;
		const height = this._calculateHeight();
		const arrowWidth = this._arrowWidth;
		const b = this._border;

		const top = this._arrowStyle & SpeechBubble.ARROW_STYLE.TOP ? 0 + arrowWidth : 0;
		const left = this._arrowStyle & SpeechBubble.ARROW_STYLE.LEFT ? 0 + arrowWidth : 0;
		const bottom = top + height;
		const right = left + width;

		let path = [];

		path.push(["M", left + b, top]);
		if (this._arrowStyle & SpeechBubble.ARROW_STYLE.TOP) {
			const arrowLeft = !!(this._arrowStyle & SpeechBubble.ARROW_STYLE.MODIFIED);
			const arrowStart = (right - left) / 2 - arrowWidth / 2;
			const arrowTipX = arrowLeft ? arrowStart : arrowStart + arrowWidth;

			path.push(["L", arrowStart, top]);
			path.push(["L", arrowTipX, top - arrowWidth]);
			path.push(["L", arrowStart + arrowWidth, top]);
		}

		path.push(["L", right - b, top]);
		path.push(["A", b, b, 0, 0, 1, right, top + b]);
		path.push(["L", right, bottom - b]);
		path.push(["A", b, b, 0, 0, 1, width - b, bottom]);
		if (this._arrowStyle & SpeechBubble.ARROW_STYLE.BOTTOM) {
			const arrowStart = (right - left) / 2 - arrowWidth / 2;
			const arrowLeft = !!(this._arrowStyle & SpeechBubble.ARROW_STYLE.MODIFIED);
			const arrowTipX = arrowLeft ? arrowStart : arrowStart + arrowWidth;

			path.push(["L", arrowStart + arrowWidth, height]);
			path.push(["L", arrowTipX, bottom + arrowWidth]);
			path.push(["L", arrowStart, bottom]);
		}
		path.push(["L", left + b, bottom]);
		path.push(["A", b, b, 0, 0, 1, left, bottom - b]);
		path.push(["L", left, top + b]);
		path.push(["A", b, b, 0, 0, 1, left + b, top]);
		path.push(["Z"]);

		return path.map(([first, ...rest]) => {
			return first + rest.join(",");
		}).join(" ");
	}

	scrollDown() {
		this._scrollBy(1);
	}

	scrollUp() {
		this._scrollBy(-1);
	}

	end() {
		this.remove();
		this.dispatchEvent(new CustomEvent(SpeechBubble.Event.End));
		if (this.onend) this.onend(new CustomEvent(SpeechBubble.Event.End));
	}

	show() {
		document.body.appendChild(this);
	}

	private _scrollBy(l: number): void {
		const currentScroll = (-1 * parseInt(this._text.style.top) | 0) / this._lineHeight;
		this._scrollTo(currentScroll + l);
	}

	private _scrollTo(line: number = 0) {
		const totalLineCount = this._calculateNumberOfLines(true);
		if (line > totalLineCount - this._maxNumberOfLines)
			line = totalLineCount - this._maxNumberOfLines;
		if (line < 0)
			line = 0;

		this._text.style.top = -1 * line * 16 + "px";
	}

	private _calculateHeight() {
		const lineCount = this._calculateNumberOfLines(false);
		return 5 + lineCount * 16 + 5;
	}

	private _calculateNumberOfLines(skipClipping: boolean): number {
		const lineCount = this._text.getBoundingClientRect().height / 16;
		let line = Math.max(1, lineCount);

		if (skipClipping) return line;
		return Math.min(line, 5);
	}
}

export default SpeechBubble;
