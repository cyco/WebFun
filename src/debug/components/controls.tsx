import "./controls.scss";

import { Component } from "src/ui";
import { IconButton } from "src/ui/components";

class Controls extends Component {
	public static readonly tagName = "wf-debug-controls";
	public static readonly observedAttributes = ["running"];

	public ontogglepause = (): void => void 0;
	public onstep = (): void => void 0;
	public ondraw = (): void => void 0;
	public onfastforward = (): void => void 0;

	private _stepButton: IconButton;
	private _fastForwardButton: IconButton;
	private _playButton: IconButton;

	constructor() {
		super();

		this._stepButton = (
			<IconButton icon="step-forward" onclick={() => this.onstep()} />
		) as IconButton;
		this._fastForwardButton = (
			<IconButton icon="fast-forward" onclick={() => this.onfastforward()} />
		) as IconButton;
		this._playButton = (
			<IconButton icon="play" onclick={() => this.ontogglepause()} />
		) as IconButton;
	}

	get running(): boolean {
		return this.hasAttribute("running");
	}

	set running(flag: boolean) {
		if (flag) this.setAttribute("running", "");
		else this.removeAttribute("running");
	}

	protected connectedCallback(): void {
		this.appendChild(this._playButton);
		this.appendChild(this._stepButton);
		this.appendChild(this._fastForwardButton);
	}

	protected attributeChangedCallback(attribute: string): void {
		if (attribute === "running") {
			const isRunning = this.hasAttribute("running");
			this._playButton.icon = isRunning ? "pause" : "play";
			this._stepButton.disabled = isRunning;
			this._fastForwardButton.disabled = isRunning;
		}
	}
}

export default Controls;
