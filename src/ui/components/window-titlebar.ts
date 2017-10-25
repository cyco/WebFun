import { identity } from "src/util";
import Point from "../../util/point";
import Component from "../component";
import Menu from "../menu";
import View from "../view";
import Menubar from "./menubar";
import Window from "./window";
import "./window-titlebar.scss";

class WindowTitlebar extends Component {
	public onclose: Function = identity;
	private _menu: Menu = null;
	private _menubar: Menubar = null;
	private _titleNode: HTMLElement = null;
	private _window: Window;
	private _closeButton: View;

	constructor() {
		super();

		this._closeButton = new View();
		this._closeButton.element.classList.add("close-button");
	}

	static get TagName() {
		return "wf-window-titlebar";
	}

	get window() {
		return this._window;
	}

	set window(window: Window) {
		this._window = window;
		this._closeButton.element.onclick = () => this._window.close();
		this._setupDragging(window);
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
			this._menubar = <Menubar>document.createElement(Menubar.TagName);
			this._menubar.menu = m;
			if (this.isConnected)
				this.appendChild(this._menubar);
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
		return this._closeButton.element.style.display !== "none";
	}

	set closable(flag) {
		this._closeButton.element.style.display = flag ? "" : "none";
	}

	connectedCallback() {
		super.connectedCallback();

		this.appendChild(this._closeButton.element);
		if (this._menubar) this.appendChild(this._menubar);
	}

	private _setupDragging(win: Window) {
		let dragLocation: Point;
		const mouseMove = (event: MouseEvent) => {
			win.x = event.clientX - dragLocation.x;
			win.y = event.clientY - dragLocation.y;
		};

		const mouseUp = () => {
			window.removeEventListener("mouseup", mouseUp);
			window.removeEventListener("mousemove", mouseMove);
		};

		const mouseDown = (event: MouseEvent) => {
			if (event.target !== this) return;
			dragLocation = new Point(event.clientX - win.x, event.clientY - win.y);
			window.addEventListener("mouseup", mouseUp);
			window.addEventListener("mousemove", mouseMove);
		};

		this.addEventListener("mousedown", mouseDown);
	}
}

export default WindowTitlebar;
