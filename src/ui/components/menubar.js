import { Point } from "/util";
import { ModalSession } from "/ux";
import MenuView from "./menu-view";
import MenuWindow from "./menu-window";
import MenuStack from "../menu-stack";
import { Separator } from "../menu-item";
import "./menubar.scss";

export default class Menubar extends MenuView {
	static get TagName() {
		return 'wf-menubar';
	}

	constructor() {
		super();
		this._currentItem = -1;
	}
	
	connectedCallback(){
		super.connectedCallback();

		this.classList.add("menubar");
		this.onmousedown = (e) => this.startMouseHandling(e);
	}

	startMouseHandling(event) {
		let itemIndex = this._findItemAt(new Point(event.pageX, event.pageY));
		if (itemIndex === -1) return;
		const menuItem = this.menu.items[itemIndex];
		if (!menuItem.submenu) {
			if (menuItem.callback instanceof Function) {
				menuItem.callback();
			}
			return;
		}

		const modalSession = new ModalSession();
		modalSession.onmousemove = (e) => this._mouseMoved(e);
		modalSession.onend = () => {
			window.removeEventListener("mouseup", this._mouseDownHandler);
			this._mouseDownHandler = null;

			this.querySelector(".open").classList.remove("open");
			MenuStack.sharedStack.clear();
		};
		this._modalSession = modalSession;

		// hack to only receive the mouse up event after the one currently being processed
		this._registerMouseUpHandler = () => {
			this._mouseDownHandler = () => modalSession.end();
			window.addEventListener("mouseup", this._mouseDownHandler);
			window.removeEventListener("mouseup", this._registerMouseUpHandler);
		};
		window.addEventListener("mouseup", this._registerMouseUpHandler);

		modalSession.run();
		this._showMenuForItem(itemIndex);
	}

	_mouseMoved(event) {
		const location = new Point(event.pageX, event.pageY);
		if (!this._elementContainsPoint(this, location))
			return;

		const itemIdx = this._findItemAt(location);
		if (itemIdx === this._currentItem || itemIdx === -1)
			return;

		this._closeMenuForItem(this._currentItem);
		this._showMenuForItem(itemIdx);
	}

	_closeMenuForItem(idx) {
		if (idx === -1) return;

		const itemNode = this.children[idx];

		itemNode.classList.remove("open");
		MenuStack.sharedStack.clear();
	}

	_showMenuForItem(idx) {
		if (idx === -1) return;

		const itemNode = this.children[idx];
		const menuItem = this.menu.items[idx];
		itemNode.classList.add("open");

		if (!menuItem || !menuItem.submenu) {
			this._currentItem = -1;
			return;
		}

		const menuWindow = document.createElement(MenuWindow.TagName);
		menuWindow.menu = menuItem.submenu;
		menuWindow.show(itemNode);

		this._currentItem = idx;
	}

	_elementContainsPoint(element, point) {
		const frame = element.getBoundingClientRect();
		return point.x >= frame.left && point.x <= frame.right && point.y >= frame.top && point.y <= frame.bottom;
	}

	_findItemAt(location) {
		const children = this.children;
		for (let i = 0, len = children.length; i < len; i++) {
			if (this._elementContainsPoint(children[i], location))
				return i;
		}
		return -1;
	}

	addItemNodes() {
		if (!this.menu) return;

		const self = this;

		this.menu.items.forEach((menuItem) => {
			if (menuItem === Separator) return self.addSeparatorNode();

			let node = self.addItemNode(menuItem);
		});
	}
}
