import "./input-replayer.scss";

import { Component } from "src/ui";
import { IconButton } from "src/ui/components";

import { RecordingInputManager, ReplayingInputManager } from "src/app/webfun/debug/automation";
import { InputManager } from "src/engine/input";
import { DefaultTickDuration } from "src/engine/metronome";
import { parse } from "../automation/input";
import { Engine } from "src/engine";

class InputReplayer extends Component {
	public static readonly tagName = "wf-debug-input-replayer";

	public engine: Engine = null;
	private _originalInputManager: InputManager;
	private _inputManager: ReplayingInputManager;

	private _record = (<IconButton icon="stop" onclick={() => this.stop()} />) as IconButton;
	private _fastForward = (
		<IconButton icon="fast-forward" onclick={() => this.fastForward()} />
	) as IconButton;

	protected connectedCallback(): void {
		super.connectedCallback();

		this.appendChild(this._record);
		this.appendChild(this._fastForward);
	}

	protected disconnectedCallback(): void {
		this.stop();
		super.disconnectedCallback();
	}

	public load(input: string): void {
		if (this.isInstalled()) this.uninstall();
		this._inputManager = new ReplayingInputManager();
		this._inputManager.input = input;
		this._inputManager.engine = this.engine;
		this._inputManager.addEventListener(ReplayingInputManager.Event.InputEnd, () => {
			this.normalizeSpeed();
			this.stop();
		});
	}

	private install() {
		if (this._originalInputManager) return;

		this._originalInputManager = this.engine.inputManager;
		this._originalInputManager.removeListeners();
		this._originalInputManager.engine = null;

		this.engine.inputManager = this._inputManager;
		this._inputManager.engine = this.engine;
		this._inputManager.addListeners();
	}

	private uninstall() {
		if (!this._originalInputManager) return;

		this._inputManager.removeListeners();
		this._inputManager.engine = null;

		if (this._originalInputManager instanceof RecordingInputManager) {
			this._originalInputManager.records = parse(this._inputManager.input);
		}
		this._originalInputManager.engine = this.engine;
		this._originalInputManager.addListeners();
		this.engine.inputManager = this._originalInputManager;
		this._originalInputManager = null;
	}

	public isInstalled(): boolean {
		return this._originalInputManager !== null;
	}

	public start(): void {
		this._record.icon = "stop";
		this._record.onclick = () => this.stop();
		this.install();
	}

	public fastForward(): void {
		this.engine.metronome.tickDuration = 1;
		this._fastForward.icon = "play";
		this._fastForward.onclick = () => this.normalizeSpeed();
		this.engine.metronome.stop();
		this.engine.metronome.start();
	}

	public normalizeSpeed(): void {
		this.engine.metronome.tickDuration = DefaultTickDuration;
		this._fastForward.icon = "fast-forward";
		this._fastForward.onclick = () => this.fastForward();
		this.engine.metronome.stop();
		this.engine.metronome.start();
	}

	public stop(): void {
		this._record.icon = "play";
		this._record.onclick = () => this.start();
		this.uninstall();
	}
}

export default InputReplayer;
