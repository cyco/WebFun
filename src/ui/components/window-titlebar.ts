import "./window-titlebar.scss";

import { Point, identity } from "src/util";

import AbstractWindow from "./abstract-window";
import Component from "../component";
import Menu from "../menu";
import Menubar from "./menubar";

class WindowTitlebar extends Component {
	public static readonly tagName = "wf-window-titlebar";
	public onclose: (_: Event) => void = identity;
	public onpin: (_: Event) => void = identity;
	public movable: boolean = true;
	private _menu: Menu = null;
	private _menubar: Menubar = null;
	private _titleNode: HTMLElement = null;
	private _window: AbstractWindow;
	private _closeButton: HTMLElement;
	private _pinButton: HTMLElement;
	private _buttons: HTMLElement[] = [];

	constructor() {
		super();

		this._closeButton = document.createElement("div");
		this._closeButton.classList.add("close-button");
		this._closeButton.style.display = "";
	}

	get window() {
		return this._window;
	}

	set window(window: AbstractWindow) {
		this._window = window;
		this._closeButton.onclick = () => this._window.close();

		if (this.movable) this._setupDragging(window);
	}

	get menu() {
		return this._menu;
	}

	set menu(m) {
		if (this._menubar) {
			this._menubar.remove();
			this._menubar = null;
		}

		if (m) {
			this._menubar = document.createElement(Menubar.tagName) as Menubar;
			this._menubar.menu = m;
			if (this.isConnected) this.appendChild(this._menubar);
		}

		if (this._menubar && this._titleNode) {
			this._titleNode.style.display = this._menubar ? "none" : "";
		}
	}

	get title() {
		return this._titleNode.innerText;
	}

	set title(t) {
		if (this._titleNode) {
			this._titleNode.remove();
			this._titleNode = null;
		}

		if (t) {
			if (this._menu) {
				this._titleNode.style.display = "none";
			}

			this._titleNode = document.createElement("span");
			this._titleNode.innerText = t;
			this.insertBefore(this._titleNode, null);
		}
	}

	get closable() {
		return this._closeButton.style.display !== "none";
	}

	set closable(flag) {
		this._closeButton.style.display = flag ? "" : "none";
	}

	protected connectedCallback() {
		super.connectedCallback();

		this.appendChild(this._closeButton);
		if (this._menubar) this.appendChild(this._menubar);
		this._buttons.forEach(btn => this.appendChild(btn));
	}

	private _setupDragging(win: AbstractWindow) {
		let dragLocation: Point;
		const mouseMove = (event: MouseEvent) => {
			win.origin = new Point(event.clientX - dragLocation.x, event.clientY - dragLocation.y);

			event.preventDefault();
			event.stopImmediatePropagation();
		};

		const mouseUp = () => {
			document.removeEventListener("mouseup", mouseUp);
			document.removeEventListener("mousemove", mouseMove);
		};

		const mouseDown = (event: MouseEvent) => {
			if (event.target !== this) return;
			dragLocation = new Point(event.clientX - win.x, event.clientY - win.y);
			document.addEventListener("mouseup", mouseUp);
			document.addEventListener("mousemove", mouseMove);

			event.preventDefault();
			event.stopImmediatePropagation();

			const manager = this.windowManager;
			if (manager) manager.focus(this._window);
		};

		this.addEventListener("mousedown", mouseDown);
	}

	set pinnable(flag: boolean) {
		if (flag === !!this._pinButton) return;

		if (flag) {
			this._pinButton = document.createElement("i");
			this._pinButton.classList.add("fa");
			this._pinButton.classList.add("fa-thumb-tack");
			this._pinButton.classList.add("pin");
			this._pinButton.onclick = () => (this.pinned = !this.pinned);
			this.addButton(this._pinButton);
		} else {
			this._pinButton.remove();
			this._buttons.remove(this._pinButton);
			this._pinButton = null;
		}
	}

	get pinnable() {
		return !!this._pinButton;
	}

	set pinned(flag: boolean) {
		if (!this.pinnable) return;
		if (flag) this._pinButton.classList.add("on");
		else this._pinButton.classList.remove("on");

		if (this.onpin instanceof Function) this.onpin(new CustomEvent("pin"));
	}

	get pinned() {
		return this.pinnable && this._pinButton.classList.contains("on");
	}

	public addButton(button: HTMLElement) {
		this._buttons.push(button);
		if (this.isConnected) {
			this.appendChild(button);
		}
	}

	private get windowManager() {
		return this._window.manager;
	}
}

export default WindowTitlebar;
