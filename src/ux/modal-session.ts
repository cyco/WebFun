import "./modal-session.scss";

import { Point, dispatch } from "src/util";

import { document } from "src/std/dom";

class ModalSession {
	protected _overlay: HTMLDivElement;
	private _locationHandler: (_: MouseEvent) => void;
	private _endHandler: (_: number) => void;
	private _lastMouseLocation: Point;
	private _overlayContainer: Element = window.document.body;
	private _eventNode: Element = (window as unknown) as Element;

	constructor() {
		const overlay = document.createElement("div");
		overlay.classList.add("modal-session");
		this._overlay = overlay;
	}

	get lastMouseLocation(): Point {
		return this._lastMouseLocation;
	}

	get style(): CSSStyleDeclaration {
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

	get onend(): (_: number) => void {
		return this._endHandler;
	}

	set onend(h: (_: number) => void) {
		this._endHandler = h;
	}

	public run(): void {
		this._overlay.classList.add("global");
		this.setupEvents();
	}

	public runForWindow(node: Element): void {
		this._overlayContainer = node;
		this._eventNode = node;

		const { width, height } = node.getBoundingClientRect();
		this._overlay.style.width = `${width}px`;
		this._overlay.style.height = `${height}px`;
		this._overlay.classList.add("attached");
		this.setupEvents();
	}

	private setupEvents(): void {
		this._overlayContainer.appendChild(this._overlay);
		this._locationHandler = e => (this._lastMouseLocation = new Point(e.clientX, e.clientY));
		["mouseup", "mousedown", "mousemove"].forEach(eventName =>
			this._eventNode.addEventListener(eventName, this._locationHandler)
		);
	}

	public async end(code: number): Promise<void> {
		["mouseup", "mousedown", "mousemove"].forEach(eventName =>
			this._eventNode.removeEventListener(eventName, this._locationHandler)
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
