import Component from "../component";
import "./progress-indicator.scss";

class ProgressIndicator extends Component {
	public static readonly TagName = "wf-progress-indicator";

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
