import { Component } from "src/ui";
import "./split-view.scss";

class SplitView extends Component {
	public static readonly tagName = "wf-split-view";

	protected connectedCallback() {
		console.log("connected");
	}

	protected disconnectedCallback() {
		console.log("disconnected");
	}
}

export default SplitView;
