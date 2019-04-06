import "./progress-indicator.scss";

import Component from "../component";

class ProgressIndicator extends Component {
	public static readonly tagName = "wf-progress-indicator";

	public connectedCallback() {
		super.connectedCallback();

		this.appendChild(
			<span>
				<div />
				<div />
				<div />
				<div />
				<div />
				<div />
				<div />
				<div />
				<div />
				<div />
				<div />
				<div />
			</span>
		);
	}

	protected disconnectedCallback() {
		this.textContent = "";
		super.disconnectedCallback();
	}
}

export default ProgressIndicator;
