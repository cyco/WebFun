import "./menu-item.scss";

import Component from "../component";
import MenuItem from "src/ui/menu-item";
import MenuItemState from "src/ui/menu-item-state";

class MenuItemComponent extends Component {
	public static readonly tagName = "wf-menu-item";
	private _item: MenuItem = null;

	get item(): MenuItem {
		return this._item;
	}

	set item(i: MenuItem) {
		if (this._item) this._reset();
		this._item = i;
		if (this._item) this._rebuild();
	}

	private _reset() {
		this.onmouseup = null;
	}

	protected connectedCallback(): void {
		super.connectedCallback();
		this._rebuild();
	}

	protected disconnectedCallback(): void {
		this.textContent = "";
		super.disconnectedCallback();
	}

	private _rebuild() {
		this.textContent = "";
		const item: Partial<MenuItem> = this.item || {};
		this.appendChild(<span className="state" />);

		const state = this.evaluate(item.state, MenuItemState.Off);
		this._reflectState(state);

		const enabled = this.evaluate<boolean>(item.enabled, true);
		if (enabled) this.removeAttribute("disabled");
		else this.setAttribute("disabled", "");

		const title = this.buildTitle(item.title, item.mnemonic);
		title.classList.add("title");
		this.appendChild(title);

		if (item.beta) {
			this.appendChild(<span className="beta">Beta</span>);
		}

		if (item.submenu) {
			this.setAttribute("submenu", "");
			this.appendChild(
				<span className="submenu">
					<i className="fa fa-caret-right"></i>
				</span>
			);
		} else {
			this.removeAttribute("submenu");
		}
	}

	private buildTitle(t: string | (() => string), mnemonicIndex: number) {
		const title = this.evaluate(t, "");
		const titleNode = document.createElement("span");

		if (mnemonicIndex === undefined) {
			titleNode.innerText = title;
			return titleNode;
		}

		const preMnemonic = title.substring(0, mnemonicIndex);
		const mnemonic = title.substring(mnemonicIndex, mnemonicIndex + 1);
		const postMnemonic = title.substring(mnemonicIndex + 1);

		const mnemonicHighlight = document.createElement("span");
		mnemonicHighlight.classList.add("mnemonic");
		mnemonicHighlight.appendChild(document.createTextNode(mnemonic));

		titleNode.appendChild(document.createTextNode(preMnemonic));
		titleNode.appendChild(mnemonicHighlight);
		titleNode.appendChild(document.createTextNode(postMnemonic));

		return titleNode;
	}

	private _reflectState(state: MenuItemState) {
		switch (state) {
			case MenuItemState.Mixed:
				this.setAttribute("state", "mixed");
				break;
			case MenuItemState.On:
				this.setAttribute("state", "on");
				break;
			default:
				this.removeAttribute("state");
				break;
		}
	}

	private evaluate<T>(thing: T | (() => T), def: T): T {
		if (thing instanceof Function) {
			return thing();
		}

		return thing !== undefined ? thing : def;
	}
}

export default MenuItemComponent;
