import Component from "../component";
import WindowTitlebar from "./window-titlebar";
import "./window.scss";
import Menu from "src/ui/menu";
import { PointLike } from "src/util";

export const Event = {
	DidClose: "didClose"
};

class Window extends Component {
	public static TagName = "wf-window";
	public static readonly Event = Event;
	private _autosaveName: string;
	private _titlebar: WindowTitlebar;
	private _content: HTMLElement;
	private _x: number = 0;
	private _y: number = 0;


	constructor() {
		super();

		this._titlebar = <WindowTitlebar>document.createElement(WindowTitlebar.TagName);
		this._content = document.createElement("div");
		this._content.classList.add("content");
	}

	get content() {
		return this._content;
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

	get movable() {
		return this._titlebar.movable;
	}

	set movable(flag: boolean) {
		this._titlebar.movable = flag;
	}

	get pinnable() {
		return this._titlebar.pinnable;
	}

	set pinnable(flag) {
		this._titlebar.pinnable = flag;
	}

	set pinned(flag) {
		this._titlebar.pinned = flag;
	}

	get pinned() {
		return this._titlebar.pinned;
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

	set onpin(cb) {
		this._titlebar.onpin = cb;
	}

	get onpin() {
		return this._titlebar.onpin;
	}

	connectedCallback() {
		super.connectedCallback();

		this._titlebar.window = this;

		this.appendChild(this._titlebar);
		this.appendChild(this._content);

		this._update();
	}

	public center(): void {
		const windowWidth = window.document.documentElement.clientWidth;
		const windowHeight = window.document.documentElement.clientHeight;

		const style = window.getComputedStyle(this);
		this.x = (windowWidth - parseFloat(style.width)) / 2.0;
		this.y = (windowHeight - parseFloat(style.height)) / 2.0;
	}

	public close() {
		this.remove();
		this.onclose();
		this.dispatchEvent(new CustomEvent(Event.DidClose));
	}

	private _update() {
		if (!this.isConnected) return;

		this.style.top = `${this._y | 0}px`;
		this.style.left = `${this._x | 0}px`;

		localStorage.store(this.stateKey, {x: this._x, y: this._y});
	}

	set autosaveName(name: string) {
		this._autosaveName = name;

		const storedState = <PointLike>localStorage.load(this.stateKey);
		if (storedState) {
			this._x = storedState.x;
			this._y = storedState.y;
			this._update();
		}
	}

	get autosaveName(): string {
		return this._autosaveName;
	}

	protected get hasStoredState(): boolean {
		return localStorage.has(this.stateKey);
	}

	private get stateKey(): string {
		return `window-state.${this._autosaveName}`;
	}
}

export default Window;
