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

		const stepButton = new IconButton();
		stepButton.icon = "step-forward";
		stepButton.onclick = () => (this.onstep instanceof Function ? this.onstep() : null);
		this._stepButton = stepButton;

		const fastForward = new IconButton();
		fastForward.icon = "fast-forward";
		fastForward.onclick = () => (this.onfastforward instanceof Function ? this.onfastforward() : null);
		this._fastForwardButton = fastForward;

		const playButton = new IconButton();
		playButton.icon = "play";
		playButton.onclick = () => (this.ontogglepause instanceof Function ? this.ontogglepause() : null);
		this._playButton = playButton;
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
