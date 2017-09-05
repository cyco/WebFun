import "./speech-bubble.scss";
import View from "./view";
import { dispatch } from "src/util";
import { Button } from "src/ui/components";

export const Event = {
	End: "end"
};

export default class SpeechBubble extends View {
	static get Event() {
		return Event;
	}

	static get ARROW_STYLE() {
		return {
			MODIFIED: 1,

			BOTTOM: 2,
			LEFT: 4,
			RIGHT: 6,
			TOP: 8
		};
	}

	constructor() {
		super();

		this._lineHeight = 16;
		this._maxNumberOfLines = 5;
		this._border = 5;
		this._width = 170;
		this._arrowWidth = 16;
		this._arrowStyle = SpeechBubble.ARROW_STYLE.TOP;

		this.element.style.width = this._width + "px";
		this.element.style.position = "absolute";

		this.element.classList.add("speech-bubble");

		const textContainer = document.createElement("div");
		textContainer.classList.add("text-container");

		const text = document.createElement("div");
		text.classList.add("text");
		textContainer.appendChild(text);
		this._text = text;

		this.element.appendChild(textContainer);

		this._setupButtons();

		this.onend = null;

		Object.seal(this);
	}

	_setupButtons() {
		const self = this;

		const buttonBar = document.createElement("div");
		buttonBar.classList.add("controls");

		const up = document.createElement(Button.TagName);
		up.classList.add("bordered");
		up.classList.add("up");
		up.onclick = () => self.scrollUp();
		up.icon = "caret-up";
		up.fixedWidth = true;
		buttonBar.appendChild(up);
		this._upButton = up;

		const down = document.createElement(Button.TagName);
		down.classList.add("bordered");
		down.classList.add("down");
		down.onclick = () => self.scrollDown();
		down.icon = "caret-down";
		down.fixedWidth = true;
		buttonBar.appendChild(down);
		this._downButton = down;

		const end = document.createElement(Button.TagName);
		end.classList.add("bordered");
		end.classList.add("end");
		end.onclick = () => self.end();
		end.icon = "circle";
		end.fixedWidth = true;
		buttonBar.appendChild(end);
		end.enabled = true;
		this._endButton = end;

		this.element.appendChild(buttonBar);
	}

	_setupBackground() {
		const previousBackground = this.element.querySelector("svg");
		if (previousBackground) previousBackground.remove();

		const numberOfLines = this._calculateNumberOfLines();
		if (numberOfLines === 1) this.element.classList.add("singleline");
		else this.element.classList.remove("singleline");

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

		this.element.insertBefore(background, this.element.firstChild);

		if (this._arrowStyle & SpeechBubble.ARROW_STYLE.TOP ||
			this._arrowStyle & SpeechBubble.ARROW_STYLE.BOTTOM) {
			this.element.style.height = height + arrowWidth + "px";
			this.element.style.width = width + "px";
			background.setAttribute("height", height + arrowWidth);
			background.setAttribute("width", width);

		} else if (this._arrowStyle & SpeechBubble.ARROW_STYLE.LEFT ||
			this._arrowStyle & SpeechBubble.ARROW_STYLE.RIGHT) {
			this.element.style.height = height + "px";
			this.element.style.width = width + arrowWidth + "px";
			background.setAttribute("height", height);
			background.setAttribute("width", width + arrowWidth);
		}

		const leftArrowWidth = (this._arrowStyle & SpeechBubble.ARROW_STYLE.LEFT ? arrowWidth : 0);
		const rightArrowWidth = (this._arrowStyle & SpeechBubble.ARROW_STYLE.RIGHT ? arrowWidth : 0);
		const topArrowWidth = (this._arrowStyle & SpeechBubble.ARROW_STYLE.TOP ? arrowWidth : 0);
		const bottomArrowWidth = (this._arrowStyle & SpeechBubble.ARROW_STYLE.BOTTOM ? arrowWidth : 0);
		this._text.parentNode.style.left = 5 + leftArrowWidth + "px";
		this._text.parentNode.style.top = 5 + topArrowWidth + "px";
		this._text.parentNode.style.bottom = 5 + bottomArrowWidth + "px";
		this._text.parentNode.style.right = 21 + 5 + rightArrowWidth + "px";

		this._endButton.parentNode.style.bottom = 5 + bottomArrowWidth + "px";
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
			const arrowLeft = !!this._arrowStyle & SpeechBubble.ARROW_STYLE.MODIFIED;
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
			const arrowLeft = !!this._arrowStyle & SpeechBubble.ARROW_STYLE.MODIFIED;
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

		return path.map((pa) => {
			return pa.first() + pa.rest().join(",");
		}).join(" ");
	}

	scrollDown() {
		this._scrollBy(1);
	}

	scrollUp() {
		this._scrollBy(-1);
	}

	_scrollBy(l) {
		const currentScroll = (-1 * parseInt(this._text.style.top) | 0) / this._lineHeight;
		this._scrollTo(currentScroll + l);
	}

	_scrollTo(line) {
		const totalLineCount = this._calculateNumberOfLines(true);
		if (line > totalLineCount - this._maxNumberOfLines)
			line = totalLineCount - this._maxNumberOfLines;
		if (line < 0)
			line = 0;

		this._text.style.top = -1 * line * 16 + "px";

		this._upButton.enabled = line !== 0;
		this._downButton.enabled = line !== totalLineCount - this._maxNumberOfLines;
		//        this._endButton.enabled = line === totalLineCount - this._maxNumberOfLines || totalLineCount === 1;
	}

	end() {
		this.element.remove();
		this.dispatchEvent(SpeechBubble.Event.End);
	}

	show() {
		document.body.appendChild(this.element);
	}

	_calculateHeight() {
		const lineCount = this._calculateNumberOfLines();
		return 5 + lineCount * 16 + 5;
	}

	_calculateNumberOfLines(skipClipping) {
		const lineCount = this._text.getBoundingClientRect().height / 16;
		let line = Math.max(1, lineCount);

		if (skipClipping) return line;
		return Math.min(line, 5);
	}

	get text() {
		return this._text.textContent;
	}

	set text(t) {
		while (this._text.firstChild)
			this._text.firstChild.remove();

		const lines = t.split("\n");
		lines.forEach((line) => {
			this._text.append(line.replace("/\r//"));
			this._text.appendChild(document.createElement("br"));
		});

		const self = this;
		dispatch(() => {
			self._setupBackground();
			self._scrollTo(0);
		});
	}

	get x() {
		return parseInt(this.element.style.left);
	}

	set x(v) {
		this.element.style.left = (v - parseInt(this._width) / 2) + "px";
	}

	get y() {
		return parseInt(this.element.style.top);
	}

	set y(v) {
		this.element.style.top = v + "px";
	}
}
