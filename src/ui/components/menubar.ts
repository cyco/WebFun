import { Point } from "src/util";
import { ModalSession } from "src/ux";
import MenuStack from "../menu-stack";
import MenuView from "./menu-view";
import MenuWindow from "./menu-window";
import "./menubar.scss";

class Menubar extends MenuView {
	public static TagName: string = "wf-menubar";

	private _currentItem: number = -1;
	private _mouseDownHandler: (_: MouseEvent) => void;
	private _modalSession: ModalSession;
	private _registerMouseUpHandler: () => void;

	protected connectedCallback() {
		super.connectedCallback();

		this.classList.add("menubar");
		this.onmousedown = (e: MouseEvent) => this.startMouseHandling(e);
	}

	startMouseHandling(event: MouseEvent) {
		let itemIndex = this._findItemAt(new Point(event.pageX, event.pageY));
		if (itemIndex === -1) return;
		const menuItem = this.menu.items[itemIndex];
		if (!menuItem.submenu) {
			// TODO: only execute callback if item is enabled
			if (menuItem.callback instanceof Function) {
				menuItem.callback();
			}
			return;
		}

		const modalSession = new ModalSession();
		modalSession.onmousemove = e => this._mouseMoved(e);
		modalSession.onend = () => {
			window.removeEventListener("mouseup", this._mouseDownHandler);
			this._mouseDownHandler = null;

			this.querySelector(".open").classList.remove("open");
			MenuStack.sharedStack.clear();
		};
		this._modalSession = modalSession;

		// HACK: only receive the mouse up event after the one currently being processed
		this._registerMouseUpHandler = () => {
			this._mouseDownHandler = () => modalSession.end(0);
			window.addEventListener("mouseup", this._mouseDownHandler);
			window.removeEventListener("mouseup", this._registerMouseUpHandler);
		};
		window.addEventListener("mouseup", this._registerMouseUpHandler);

		modalSession.run();
		this._showMenuForItem(itemIndex);
	}

	_mouseMoved(event: MouseEvent): void {
		const location = new Point(event.pageX, event.pageY);
		if (!this._elementContainsPoint(this, location)) return;

		const itemIdx = this._findItemAt(location);
		if (itemIdx === this._currentItem || itemIdx === -1) return;

		this._closeMenuForItem(this._currentItem);
		this._showMenuForItem(itemIdx);
	}

	_closeMenuForItem(idx: number): void {
		if (idx === -1) return;

		const itemNode = this.children[idx];

		itemNode.classList.remove("open");
		MenuStack.sharedStack.clear();
	}

	_showMenuForItem(idx: number): void {
		if (idx === -1) return;

		const itemNode = this.children[idx];
		const menuItem = this.menu.items[idx];
		itemNode.classList.add("open");

		if (!menuItem || !menuItem.submenu) {
			this._currentItem = -1;
			return;
		}

		const menuWindow = <MenuWindow>document.createElement(MenuWindow.TagName);
		menuWindow.menu = menuItem.submenu;
		menuWindow.show(itemNode);

		this._currentItem = idx;
	}

	_elementContainsPoint(element: Element, point: Point): boolean {
		const frame = element.getBoundingClientRect();
		return (
			point.x >= frame.left &&
			point.x <= frame.right &&
			point.y >= frame.top &&
			point.y <= frame.bottom
		);
	}

	_findItemAt(location: Point): number {
		return Array.from(this.children).findIndex(child =>
			this._elementContainsPoint(child, location)
		);
	}
}

export default Menubar;
