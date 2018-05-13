import Component from "../component";
import "./popover.scss";

class Popover extends Component {
	public static TagName = "wf-popover";
	public content: HTMLElement = <div />;

	protected connectedCallback() {
		super.connectedCallback();
		this.appendChild(this.content);
	}

	protected disconnectedCallback() {
		super.disconnectedCallback();
		this.content.remove();
	}
}

export default Popover;
