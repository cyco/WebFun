import { Component } from "src/ui";
import "./split-view.scss";

class SplitView extends Component {
	public static readonly TagName = "wf-split-view";

	connectedCallback() {
		console.log("connected");
	}

	disconnectedCallback() {
		console.log("disconnected");
	}
}

export default SplitView;
