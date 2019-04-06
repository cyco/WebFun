import "./split-view.scss";

import { Component } from "src/ui";

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
