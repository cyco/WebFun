import Component from "../component";
import "./popover.scss";

class Popover extends Component {
	public static TagName = "wf-popover";
	public content: HTMLElement = <div />;

	connectedCallback() {
		super.connectedCallback();
		this.appendChild(this.content);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.content.remove();
	}
}

export default Popover;
