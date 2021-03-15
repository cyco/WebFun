import "./menubar.scss";

import AbstractMenuView from "./abstract-menu-view";
import MenuItem from "./menu-item";
import MenuStack from "../menu-stack";
import MenuWindow from "./menu-window";
import { ModalSession } from "src/ux";
import { Point } from "src/util";

class Menubar extends AbstractMenuView {
	public static readonly tagName = "wf-menubar";

	private _currentItem: number = -1;
	private _mouseDownHandler: (_: MouseEvent) => void;
	private _modalSession: ModalSession;
	private _registerMouseUpHandler: () => void;

	protected connectedCallback(): void {
		super.connectedCallback();
		this.onmousedown = (e: MouseEvent) => this.startMouseHandling(e);
	}

	startMouseHandling(event: MouseEvent): void {
		const itemIndex = this._findItemAt(new Point(event.pageX, event.pageY));
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

			const openItem = this.querySelector("[open]");
			if (openItem) openItem.removeAttribute("open");
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

	private _mouseMoved(event: MouseEvent): void {
		const location = new Point(event.pageX, event.pageY);
		if (!this._elementContainsPoint(this, location)) return;

		const itemIdx = this._findItemAt(location);
		if (itemIdx === this._currentItem || itemIdx === -1) return;

		this._closeMenuForItem(this._currentItem);
		this._showMenuForItem(itemIdx);
	}

	private _closeMenuForItem(idx: number): void {
		if (idx === -1) return;

		const itemNode = this.children[idx];
		this._currentItem = -1;

		itemNode.removeAttribute("open");
		MenuStack.sharedStack.clear();
	}

	handleEvent(e: MouseEvent): void {
		if (e.type === "mouseup") {
			const node = (e.target as Element).closest(MenuItem.tagName) as MenuItem;
			if (!node) return;
			const item = node.item;
			if (!item || !item.enabled) return;

			this._closeMenuForItem(this._currentItem);
			this._modalSession.end(0);

			if (item.callback) item.callback();

			e.preventDefault();
			e.stopPropagation();
		}
	}

	private _showMenuForItem(idx: number): void {
		if (idx === -1) return;

		const itemNode = this.children[idx];
		const menuItem = this.menu.items[idx];
		itemNode.setAttribute("open", "");

		if (!menuItem || !menuItem.submenu) {
			this._currentItem = -1;
			return;
		}

		const menuWindow = document.createElement(MenuWindow.tagName) as MenuWindow;
		menuWindow.menu = menuItem.submenu;
		menuWindow.show(itemNode);
		menuWindow.addEventListener("mouseup", this);

		this._currentItem = idx;
	}

	private _elementContainsPoint(element: Element, point: Point): boolean {
		const frame = element.getBoundingClientRect();
		return (
			point.x >= frame.left + window.scrollX &&
			point.x <= frame.right + window.scrollX &&
			point.y >= frame.top + window.scrollY &&
			point.y <= frame.bottom + window.scrollY
		);
	}

	private _findItemAt(location: Point): number {
		return Array.from(this.children).findIndex(child =>
			this._elementContainsPoint(child, location)
		);
	}
}

export default Menubar;
