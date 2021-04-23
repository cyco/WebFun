import "./abstract-window.scss";

import { localStorage } from "src/std/dom";
import { Point, PointLike } from "src/util";

import Component from "../component";
import Menu from "src/ui/menu";
import WindowManager from "src/ui/window-manager";
import WindowTitlebar from "./window-titlebar";

export const Event = {
	DidClose: "didClose"
};

abstract class AbstractWindow extends Component {
	public static readonly Event = Event;
	public manager: WindowManager;
	protected _autosaveName: string;
	protected _titlebar: WindowTitlebar;
	private _content: HTMLElement;
	private _x: number = 0;
	private _y: number = 0;

	constructor() {
		super();

		this._titlebar = document.createElement(WindowTitlebar.tagName) as WindowTitlebar;
		this._content = document.createElement("div");
		this._content.classList.add("content");
	}

	get content(): HTMLElement {
		return this._content;
	}

	set content(newContent: HTMLElement) {
		newContent.classList.add("content");
		this._content.replaceWith(newContent);
		this._content = newContent;
	}

	get x(): number {
		if (!this.isConnected) return this._x;

		return parseFloat(this.style.left);
	}

	set origin(p: Point) {
		this._x = p.x;
		this._y = p.y;
		this._update();
	}

	get origin(): Point {
		return new Point(this._x, this._y);
	}

	get y(): number {
		if (!this.isConnected) return this._y;

		return parseFloat(this.style.top);
	}

	get menu(): Menu {
		return this._titlebar.menu;
	}

	set menu(menu: Menu) {
		this._titlebar.menu = menu;
	}

	get closable(): boolean {
		return this._titlebar.closable;
	}

	set closable(flag: boolean) {
		this._titlebar.closable = flag;
	}

	get movable(): boolean {
		return this._titlebar.movable;
	}

	set movable(flag: boolean) {
		this._titlebar.movable = flag;
	}

	get pinnable(): boolean {
		return this._titlebar.pinnable;
	}

	set pinnable(flag: boolean) {
		this._titlebar.pinnable = flag;
	}

	set pinned(flag: boolean) {
		this._titlebar.pinned = flag;
	}

	get pinned(): boolean {
		return this._titlebar.pinned;
	}

	get title(): string {
		return this._titlebar.title;
	}

	set title(t: string) {
		this._titlebar.title = t;
	}

	get onclose(): (event: Event) => void {
		return this._titlebar.onclose;
	}

	set onclose(cb: (event: Event) => void) {
		this._titlebar.onclose = cb;
	}

	set onpin(cb: (event: Event) => void) {
		this._titlebar.onpin = cb;
	}

	get onpin(): (event: Event) => void {
		return this._titlebar.onpin;
	}

	protected connectedCallback(): void {
		super.connectedCallback();

		this.addEventListener("mousedown", this);
		this.addEventListener("dragstart", this);

		this._titlebar.window = this;

		this.appendChild(this._titlebar);
		this.appendChild(this._content);

		this._update();
	}

	public handleEvent(event: Event): void {
		event.preventDefault();
	}

	protected disconnectedCallback(): void {
		this.removeEventListener("mousedown", this);
		this.removeEventListener("dragstart", this);

		super.disconnectedCallback();
	}

	public center(container: Element = window.document.documentElement): void {
		const windowWidth = container.clientWidth;
		const windowHeight = container.clientHeight;

		const style = window.getComputedStyle(this);
		this._x = (windowWidth - parseFloat(style.width)) / 2.0;
		this._y = (windowHeight - parseFloat(style.height)) / 2.0;
		this._update();
	}

	public close(): void {
		this.remove();
		this.onclose(new CustomEvent("close"));
		this.dispatchEvent(new CustomEvent(Event.DidClose, { bubbles: false }));
	}

	private _update(): void {
		if (!this.isConnected) return;

		this.style.top = `${this._y | 0}px`;
		this.style.left = `${this._x | 0}px`;

		localStorage.store(this.stateKey, { x: this._x, y: this._y });
	}

	set autosaveName(name: string) {
		this._autosaveName = name;

		const storedState = localStorage.load(this.stateKey) as PointLike;
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

	addTitlebarButton(element: HTMLElement): void {
		this._titlebar.addButton(element);
	}
}

export default AbstractWindow;
