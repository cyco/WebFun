import { dispatch, Point } from "src/util";
import ResetCursor from "./reset-cursor";

export default class ModalSession {
	constructor() {
		const overlay = document.createElement("div");
		overlay.classList.add("full-size");
		overlay.style.position = "fixed";
		overlay.style.zIndex = 1000;

		this._overlay = overlay;
	}

	run() {
		document.body.appendChild(this._overlay);
		this._locationHandler = (e) => (this._lastMouseLocation = new Point(e.clientX, e.clientY));
		[ "mouseup", "mousedown", "mousemove", "mousedrag" ].forEach(
			(eventName) => window.addEventListener(eventName, this._locationHandler));

	}

	end(code) {
		[ "mouseup", "mousedown", "mousemove", "mousedrag" ].forEach(
			(eventName) => window.removeEventListener(eventName, this._locationHandler));
		ResetCursor();
		this._overlay.remove();
		this._whenOverlayIsGone(() => {
			this._overlay = null;
			if (this.onend) this.onend(code);
		});
	}

	_whenOverlayIsGone(callback) {
		// hack to give webkit time to remove the overlay, so elementFromPoint works correctly
		if (document.elementFromPoint(0, 0) === this._overlay) {
			dispatch(() => this._whenOverlayIsGone(callback), 1);
			return;
		}

		callback();
	}

	/* style handling */
	get style() {
		return this._overlay.style;
	}

	set cursor(c) {
		let style = this._overlay.style;
		const cursorStyle = c ? "url(" + c + ") 16 16, auto" : "";

		// hack to get WebKit to change the cursor without further mouse events
		// should have been fixed in https://bugs.webkit.org/show_bug.cgi?id=101857
		dispatch(() => style.cursor = cursorStyle);
	}

	/* Event Handling */
	set onclick(h) {
		this._overlay.onclick = h;
	}

	set onmousemove(h) {
		this._overlay.onmousemove = h;
	}

	set onmousedown(h) {
		this._overlay.onmousedown = h;
	}

	set onmouseup(h) {
		this._overlay.onmouseup = h;
	}

	get onend() {
		return this._endHandler;
	}

	set onend(h) {
		this._endHandler = h;
	}

	get lastMouseLocation() {
		return this._lastMouseLocation;
	}
}
