import Component from "../component";
import View from "../view";
import WindowTitlebar from "./window-titlebar";
import "./window.scss";
import Menu from "src/ui/menu";

class Window extends Component {
	public static TagName = "wf-window";
	private _titlebar: WindowTitlebar;
	private _content: View;
	private _x: number = 0;
	private _y: number = 0;

	constructor() {
		super();

		this._titlebar = <WindowTitlebar>document.createElement(WindowTitlebar.TagName);
		this._content = new View();
		this._content.element.classList.add("content");
	}

	get content() {
		return this._content.element;
	}

	get x(): number {
		if (!this.isConnected) return this._x;

		return parseFloat(this.style.left);
	}

	set x(x: number) {
		this._x = x;
		this._update();
	}

	get y(): number {
		if (!this.isConnected) return this._y;

		return parseFloat(this.style.top);
	}

	set y(y: number) {
		this._y = y;
		this._update();
	}

	get menu() {
		return this._titlebar.menu;
	}

	set menu(menu: Menu) {
		this._titlebar.menu = menu;
	}

	get closable() {
		return this._titlebar.closable;
	}

	set closable(flag: boolean) {
		this._titlebar.closable = flag;
	}

	get title() {
		return this._titlebar.title;
	}

	set title(t: string) {
		this._titlebar.title = t;
	}

	get onclose() {
		return this._titlebar.onclose;
	}

	set onclose(cb) {
		this._titlebar.onclose = cb;
	}

	connectedCallback() {
		super.connectedCallback();

		this._titlebar.window = this;

		this.appendChild(this._titlebar);
		this.appendChild(this._content.element);

		this._update();
	}

	public center(): void {
		const windowWidth = window.document.documentElement.clientWidth;
		const windowHeight = window.document.documentElement.clientHeight;

		const style = window.getComputedStyle(this);
		this.x = (windowWidth - parseFloat(style.width)) / 2.0;
		this.y = (windowHeight - parseFloat(style.height)) / 2.0;
	}

	private _update() {
		if (!this.isConnected) return;

		this.style.top = `${this._y | 0}px`;
		this.style.left = `${this._x | 0}px`;
	}

	public close() {
		this.remove();
		this.onclose();
	}
}

export default Window;
