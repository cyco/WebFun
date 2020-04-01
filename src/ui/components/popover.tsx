import "./popover.scss";

import Component from "../component";

class Popover extends Component {
	public static readonly tagName = "wf-popover";
	public content: HTMLElement = (<div />);

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
