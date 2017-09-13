import Component from "../component";
import "./menu-item.scss";
import MenuItem, { State } from "src/ui/menu-item";

class MenuItemComponent extends Component {
	public static TagName: string = "wf-menu-item";
	private _item: MenuItem = null;

	_reset() {
		this.onmouseup = null;
	}

	_rebuild() {
		this._reset();

		const menuItem = this.item;
		const document = this.ownerDocument;

		const stateNode = this._makeStateNode(menuItem.state);
		this.appendChild(stateNode);

		if (menuItem.mnemonic !== undefined) {
			const title = menuItem.title;
			const mnemonicIndex = menuItem.mnemonic;
			const preMnemonic = title.substring(0, mnemonicIndex);
			const mnemonic = title.substring(mnemonicIndex, mnemonicIndex + 1);
			const postMnemonic = title.substring(mnemonicIndex + 1);

			const mnemonicHighlight = document.createElement("span");
			mnemonicHighlight.classList.add("mnemonic");
			mnemonicHighlight.appendChild(document.createTextNode(mnemonic));

			this.appendChild(document.createTextNode(preMnemonic));
			this.appendChild(mnemonicHighlight);
			this.appendChild(document.createTextNode(postMnemonic));
		} else {
			this.appendChild(document.createTextNode(menuItem.title));
		}

		const stateClass = menuItem.enabled ? "enabled" : "disabled";
		this.classList.add(stateClass);

		if (menuItem.enabled && menuItem.callback)
			this.onmouseup = () => menuItem.callback();
	}

	_makeStateNode(state: any): HTMLSpanElement {
		const node = document.createElement("span");
		node.classList.add("state");

		if (state === undefined) return node;

		if (state instanceof Function) try {
			state = state();
		} catch (e) {
		}

		const className = this._classNameForState(state);
		if (className) node.classList.add(className);

		return node;
	}

	_classNameForState(state: number) {
		switch (state) {
			case State.On:
				return "on";
			case State.Off:
				return "off";
			case State.Mixed:
				return "mixed";
			case State.None: /* intentional fallthrough */
			default:
				return null;
		}
	}

	set item(i) {
		if (this._item) this._reset();
		this._item = i;
		if (this._item) this._rebuild();
	}

	get item() {
		return this._item;
	}
}

export default MenuItemComponent;
