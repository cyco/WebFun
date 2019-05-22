import "./input-replayer.scss";

import { AbstractWindow, IconButton } from "src/ui/components";

import { GameController } from "src/app";
import { ReplayingInputManager } from "src/debug/automation";
import { InputManager } from "src/engine/input";
import { DefaultTickDuration } from "src/engine/metronome";

class InputReplayer extends AbstractWindow {
	public static readonly tagName = "wf-debug-input-replayer";
	title = "Input Replay";
	autosaveName = "input-replayer";
	closable = true;

	public gameController: GameController = null;
	private _originalInputManager: InputManager;
	private _inputManager: InputManager;

	private _record = <IconButton icon="stop" onclick={() => this.stop()} /> as IconButton;
	private _fastForward = (
		<IconButton icon="fast-forward" onclick={() => this.fastForward()} />
	) as IconButton;

	constructor() {
		super();

		this.content.appendChild(this._record);
		this.content.appendChild(this._fastForward);
	}

	public load(input: string[]) {
		if (this.isInstalled()) this.uninstall();
		this._inputManager = new ReplayingInputManager(input);
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
	}

	public normalizeSpeed() {
		this.gameController.engine.metronome.tickDuration = DefaultTickDuration;
		this._fastForward.icon = "fast-forward";
		this._fastForward.onclick = () => this.fastForward();
	}

	public stop() {
		this._record.icon = "play";
		this._record.onclick = () => this.start();
		this.uninstall();
	}

	public close() {
		this.stop();

		super.close();
	}
}

export default InputReplayer;
