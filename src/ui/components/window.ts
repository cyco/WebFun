import Component from "../component";
import WindowTitlebar from "./window-titlebar";
import View from "../view";
import "./window.scss";

class Window extends Component {
	public static TagName = "wf-window";
	private _titlebar: any;
	private _content: any;
	private _x: any;
	private _y: any;

	constructor() {
		super();

		this.x = 0;
		this.y = 0;

		this._titlebar = document.createElement(WindowTitlebar.TagName);

		this._content = new View();
		this._content.element.classList.add("content");
	}

	connectedCallback() {
		super.connectedCallback();

		this._titlebar.window = this;

		this.appendChild(this._titlebar);
		this.appendChild(this._content.element);
	}

	center() {
		const windowWidth = window.document.documentElement.clientWidth;
		const windowHeight = window.document.documentElement.clientHeight;

		const style = window.getComputedStyle(this);
		this.x = (windowWidth - parseFloat(style.width)) / 2.0;
		this.y = (windowHeight - parseFloat(style.height)) / 2.0;
	}

	_update() {
		if (!this.isConnected) return;

		this.style.top = `${this._y | 0}px`;
		this.style.left = `${this._x | 0}px`;
	}

	close() {
		this.remove();
		this.onclose();
	}

	get menu() {
		return this._titlebar.menu;
	}

	set menu(menu) {
		this._titlebar.menu = menu;
	}

	get closable() {
		return this._titlebar.closable;
	}

	set closable(flag) {
		this._titlebar.closable = flag;
	}

	get title() {
		return this._titlebar.title;
	}

	set title(t) {
		this._titlebar.title = t;
	}

	get content() {
		return this._content.element;
	}

	get x() {
		if (!this.isConnected) return this._x;

		return parseFloat(this.style.left);
	}

	set x(x) {
		this._x = x;
		this._update();
	}

	get y() {
		if (!this.isConnected) return this._y;

		return parseFloat(this.style.top);
	}

	set y(y) {
		this._y = y;
		this._update();
	}

	get onclose() {
		return this._titlebar.onclose;
	}

	set onclose(cb) {
		this._titlebar.onclose = cb;
	}
}

export default Window;
