import Component from "../component";
import Menubar from "./menubar";
import { identity } from "/util";
import View from "../view";
import "./window-titlebar.scss";

export default class extends Component {
	static get TagName() {
		return 'wf-window-titlebar';
	}

	constructor() {
		super();

		this._menubar = null;
		this._titleNode = null;

		this._closeButton = new View();
		this._closeButton.element.classList.add("close-button");

		this.onclose = identity;
	}

	connectedCallback() {
		super.connectedCallback();

		this.appendChild(this._closeButton.element);
		if (this._menubar) this.appendChild(this._menubar);
	}

	set window(window) {
		this._window = window;
		this._closeButton.element.onclick = () => this._window.close();
		this._setupDragging(window);
	}

	get window() {
		return this._window;
	}

	_setupDragging(win) {
		let dragLocation;
		const mouseMove = (event) => {
			win.x = event.clientX - dragLocation.x;
			win.y = event.clientY - dragLocation.y;
		};

		const mouseUp = () => {
			window.removeEventListener("mouseup", mouseUp);
			window.removeEventListener("mousemove", mouseMove);
		};

		const mouseDown = (event) => {
			if (event.target !== this) return;
			dragLocation = {
				x: event.clientX - win.x,
				y: event.clientY - win.y
			};
			window.addEventListener("mouseup", mouseUp);
			window.addEventListener("mousemove", mouseMove);
		};

		this.addEventListener("mousedown", mouseDown);
	}

	set menu(m) {
		if (this._menubar) {
			this._menubar.remove();
			this._menubar = null;
		}

		if (m) {
			this._menubar = document.createElement(Menubar.TagName);
			this._menubar.menu = m;
			if (this.isConnected)
				this.appendChild(this._menubar);
		}

		if (this._menubar && this._titleNode) {
			this._titleNode.style.display = this._menubar ? "none" : "";
		}
	}

	get menu() {
		return this._menu;
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

	get title() {
		return this._titleNode.innerText;
	}

	set closable(flag) {
		this._closeButton.element.style.display = flag ? "" : "none";
	}

	get closable() {
		return this._closeButton.element.style.display !== "none";
	}
}
