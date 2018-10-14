import Menu from "src/ui/menu";
import Component from "../component";
import "./menu-item-separator.scss";

class MenuItemSeparator extends Component {
	public static readonly tagName = "wf-menu-item-separator";
	public menu: Menu = null;

	protected connectedCallback() {
		super.connectedCallback();

		this.textContent = "";
		this.appendChild(document.createElement("div"));
	}
}

export default MenuItemSeparator;
