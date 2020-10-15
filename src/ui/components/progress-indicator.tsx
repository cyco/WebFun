import "./progress-indicator.scss";

import Component from "../component";

class ProgressIndicator extends Component {
	public static readonly tagName = "wf-progress-indicator";

	protected connectedCallback(): void {
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

	protected disconnectedCallback(): void {
		this.textContent = "";
		super.disconnectedCallback();
	}
}

export default ProgressIndicator;
