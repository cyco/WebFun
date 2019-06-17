import "./input-replayer.scss";

import { Component } from "src/ui";
import { IconButton } from "src/ui/components";

import { GameController } from "src/app";
import { ReplayingInputManager } from "src/debug/automation";
import { InputManager } from "src/engine/input";
import { DefaultTickDuration } from "src/engine/metronome";

class InputReplayer extends Component {
	public static readonly tagName = "wf-debug-input-replayer";

	public gameController: GameController = null;
	private _originalInputManager: InputManager;
	private _inputManager: ReplayingInputManager;

	private _record = <IconButton icon="stop" onclick={() => this.stop()} /> as IconButton;
	private _fastForward = (
		<IconButton icon="fast-forward" onclick={() => this.fastForward()} />
	) as IconButton;

	public connectedCallback() {
		super.connectedCallback();

		this.appendChild(this._record);
		this.appendChild(this._fastForward);
	}

	public disconnectedCallback() {
		this.stop();
		super.disconnectedCallback();
	}

	public load(input: string[]) {
		if (this.isInstalled()) this.uninstall();
		this._inputManager = new ReplayingInputManager();
		this._inputManager.input = input;
		this._inputManager.addEventListener(ReplayingInputManager.Event.InputEnd, () => {
			this.normalizeSpeed();
			this.stop();
		});
	}

	private install() {
		if (this._originalInputManager) return;

		this._originalInputManager = this.gameController.engine.inputManager;
		this._originalInputManager.removeListeners();
		this._originalInputManager.engine = null;

		this.gameController.engine.inputManager = this._inputManager;
		this._inputManager.engine = this.gameController.engine;
		this._inputManager.addListeners();
	}

	private uninstall() {
		if (!this._originalInputManager) return;

		this._inputManager.removeListeners();
		this._inputManager.engine = null;

		this._originalInputManager.engine = this.gameController.engine;
		this._originalInputManager.addListeners();
		this.gameController.engine.inputManager = this._originalInputManager;
		this._originalInputManager = null;
	}

	private isInstalled() {
		return this._originalInputManager !== null;
	}

	public start() {
		this._record.icon = "stop";
		this._record.onclick = () => this.stop();
		this.install();
	}

	public fastForward() {
		this.gameController.engine.metronome.tickDuration = 1;
		this._fastForward.icon = "play";
		this._fastForward.onclick = () => this.normalizeSpeed();
		this.gameController.engine.metronome.stop();
		this.gameController.engine.metronome.start();
	}

	public normalizeSpeed() {
		this.gameController.engine.metronome.tickDuration = DefaultTickDuration;
		this._fastForward.icon = "fast-forward";
		this._fastForward.onclick = () => this.fastForward();
		this.gameController.engine.metronome.stop();
		this.gameController.engine.metronome.start();
	}

	public stop() {
		this._record.icon = "play";
		this._record.onclick = () => this.start();
		this.uninstall();
	}
}

export default InputReplayer;
