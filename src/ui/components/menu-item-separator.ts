import Component from "../component";
import "./menu-item-separator.scss";
import Menu from "src/ui/menu";

class MenuItemSeparator extends Component {
	public static TagName: string = "wf-menu-item-separator";
	public menu: Menu = null;

	connectedCallback() {
		super.connectedCallback();

		this.clear();
		this.appendChild(document.createElement("div"));
	}
}

export default MenuItemSeparator;
