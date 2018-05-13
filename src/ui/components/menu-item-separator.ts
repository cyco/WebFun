import Menu from "src/ui/menu";
import Component from "../component";
import "./menu-item-separator.scss";

class MenuItemSeparator extends Component {
	public static tagName: string = "wf-menu-item-separator";
	public menu: Menu = null;

	protected connectedCallback() {
		super.connectedCallback();

		this.clear();
		this.appendChild(document.createElement("div"));
	}
}

export default MenuItemSeparator;
