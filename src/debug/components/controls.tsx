import { Component } from "src/ui";
import { IconButton } from "src/ui/components";
import "./controls.scss";

class Controls extends Component {
	public static readonly tagName = "wf-debug-controls";
	public static readonly observedAttributes = ["running"];

	public ontogglepause: () => void;
	public onstep: () => void;
	public ondraw: () => void;
	public onfastforward: () => void;

	private _stepButton: IconButton;
	private _fastForwardButton: IconButton;
	private _playButton: IconButton;

	constructor() {
		super();

		this.ontogglepause = null;
		this.onstep = null;
		this.ondraw = null;
		this.onfastforward = null;

		this._stepButton = (
			<IconButton
				icon="step-forward"
				onclick={() => (this.onstep instanceof Function ? this.onstep() : null)}
			/>
		) as IconButton;
		this._fastForwardButton = (
			<IconButton
				icon="fast-forward"
				onclick={() => (this.onfastforward instanceof Function ? this.onfastforward() : null)}
			/>
		) as IconButton;
		this._playButton = (
			<IconButton
				icon="play"
				onclick={() => (this.ontogglepause instanceof Function ? this.ontogglepause() : null)}
			/>
		) as IconButton;
	}

	get running() {
		return this.hasAttribute("running");
	}

	set running(flag: boolean) {
		if (flag) this.setAttribute("running", "");
		else this.removeAttribute("running");
	}

	protected connectedCallback() {
		if (this.children.length) return;

		this.appendChild(this._playButton);
		this.appendChild(this._stepButton);
		this.appendChild(this._fastForwardButton);
	}

	protected attributeChangedCallback(attribute: string) {
		if (attribute === "running") {
			const isRunning = this.hasAttribute("running");
			this._playButton.icon = isRunning ? "pause" : "play";
			this._stepButton.disabled = isRunning;
			this._fastForwardButton.disabled = isRunning;
		}
	}
}

export default Controls;
