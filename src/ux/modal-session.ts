import { dispatch, Point } from "src/util";
import { document } from "src/std/dom";
import "./modal-session.scss";

class ModalSession {
	protected _overlay: HTMLDivElement;
	private _locationHandler: (_: MouseEvent) => void;
	private _endHandler: (_: number) => void;
	private _lastMouseLocation: Point;

	constructor() {
		const overlay = document.createElement("div");
		overlay.classList.add("modal-session");
		this._overlay = overlay;
	}

	get lastMouseLocation() {
		return this._lastMouseLocation;
	}

	get style() {
		return this._overlay.style;
	}

	set cursor(c: string) {
		const cursorStyle = c ? "url(" + c + ") 16 16, auto" : "";
		// HACK: get WebKit to change the cursor without further mouse events
		// should have been fixed in https://bugs.webkit.org/show_bug.cgi?id=101857
		dispatch(() => this._overlay && (this._overlay.style.cursor = cursorStyle));
	}

	set onclick(h: (this: HTMLElement, ev: MouseEvent) => any) {
		this._overlay.onclick = h;
	}

	set onmousemove(h: (this: HTMLElement, ev: MouseEvent) => any) {
		this._overlay.onmousemove = h;
	}

	set onmousedown(h: (this: HTMLElement, ev: MouseEvent) => any) {
		this._overlay.onmousedown = h;
	}

	set onmouseup(h: (this: HTMLElement, ev: MouseEvent) => any) {
		this._overlay.onmouseup = h;
	}

	get onend() {
		return this._endHandler;
	}

	set onend(h: (_: number) => void) {
		this._endHandler = h;
	}

	run(): void {
		document.body.appendChild(this._overlay);
		this._locationHandler = e => (this._lastMouseLocation = new Point(e.clientX, e.clientY));
		["mouseup", "mousedown", "mousemove", "mousedrag"].forEach(eventName =>
			window.addEventListener(eventName, this._locationHandler)
		);
	}

	async end(code: number): Promise<void> {
		["mouseup", "mousedown", "mousemove", "mousedrag"].forEach(eventName =>
			window.removeEventListener(eventName, this._locationHandler)
		);

		this.cursor = null;
		await dispatch(() => this._overlay && this._overlay.remove(), 10);
		return new Promise<void>(resolve =>
			this._whenOverlayIsGone(() => {
				this._overlay = null;
				if (this.onend) this.onend(code);
				resolve();
			})
		);
	}

	protected _whenOverlayIsGone(callback: Function): void {
		// HACK: give webkit time to remove the overlay, so elementFromPoint works correctly
		if (document.elementFromPoint(0, 0) === this._overlay) {
			dispatch(() => this._whenOverlayIsGone(callback), 1);
			return;
		}

		callback();
	}
}

export default ModalSession;
