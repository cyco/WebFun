import { AbstractWindow } from "src/ui/components";

class WindowManager implements EventListenerObject {
	private static _defaultManager: WindowManager;
	private _container: HTMLElement;
	private _windows: AbstractWindow[] = [];
	private _topIndex = 0;
	private _topMostWindow: AbstractWindow;

	public static get defaultManager(): WindowManager {
		return (this._defaultManager = this._defaultManager || new WindowManager(document.body));
	}

	constructor(container: HTMLElement) {
		this._container = container;
	}

	public asDefaultManager(block: () => void): void {
		const globalManager = WindowManager._defaultManager;
		WindowManager._defaultManager = this;
		block();
		WindowManager._defaultManager = globalManager;
	}

	public showWindow(window: AbstractWindow): void {
		if (~this._windows.indexOf(window)) {
			this.focus(window);
			return;
		}

		window.manager = this;
		window.addEventListener(AbstractWindow.Event.DidClose, this);
		this._windows.push(window);
		this._container.appendChild(window);

		this.focus(window);
	}

	handleEvent(evt: Event): void {
		console.assert(evt.type === AbstractWindow.Event.DidClose);
		const window = evt.target as AbstractWindow;

		window.manager = null;
		window.removeEventListener(AbstractWindow.Event.DidClose, this);

		const index = this._windows.indexOf(window);
		console.assert(index !== -1);
		this._windows.splice(index, 1);
		if (window === this._topMostWindow) {
			const newTopMostWindow = this._windows.reduce((a: AbstractWindow, b: AbstractWindow) => {
				if (!a) return b;
				if (a.style.zIndex >= b.style.zIndex) return a;
				return b;
			}, null);

			if (newTopMostWindow) this.focus(newTopMostWindow);
			else this._topMostWindow = null;
		}
	}

	public focus(window: AbstractWindow): void {
		if (window === this._topMostWindow) return;

		window.style.zIndex = `${this._topIndex++}`;
		this._topMostWindow = window;
	}

	public get windows(): AbstractWindow[] {
		return this._windows;
	}

	public get topMostWindow(): AbstractWindow {
		return this._topMostWindow;
	}
}

export default WindowManager;
