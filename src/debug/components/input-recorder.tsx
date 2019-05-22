import "./input-recorder.scss";

import { AbstractWindow, IconButton, Window } from "src/ui/components";

import { DesktopInputManager } from "src/app/input";
import { DiscardingStorage } from "src/util";
import { GameController } from "src/app";
import { RecordingInputManager } from "src/debug/automation";

class InputRecorder extends AbstractWindow {
	public static readonly tagName = "wf-debug-input-recorder";
	private _gameController: GameController = null;
	private _state: Storage = new DiscardingStorage();
	private _recorder: RecordingInputManager = null;

	private _record = (
		<IconButton style={{ color: "red" }} icon="circle" onclick={() => this.toggleRecording()} />
	) as IconButton;
	private _dump = <IconButton icon="print" onclick={() => this.showLog()} />;
	private _clear = <IconButton icon="ban" onclick={() => this._recorder.clearRecord()} /> as IconButton;

	title = "Input Recorder";
	autosaveName = "input-recorder";
	closable = true;

	constructor() {
		super();

		this.content.appendChild(this._record);
		this.content.appendChild(this._clear);
		this.content.appendChild(this._dump);
	}

	public toggleRecording() {
		this._recorder.isRecording = !this._recorder.isRecording;
		if (this._recorder.isRecording) {
			this._record.style.color = "black";
			this._record.icon = "stop";
		} else {
			this._record.style.color = "red";
			this._record.icon = "circle";
		}
	}

	public connectedCallback() {
		super.connectedCallback();
		this.toggleRecording();
	}

	private showLog() {
		const result = this._recorder.dumpRecord().join(" ");
		const window = (
			<Window title="Recorded Input" autosaveName="input-recorder.output" closable={true} />
		) as Window;
		window.content.style.width = "320px";
		window.content.style.height = "270px";
		window.content.appendChild(<textarea value={result} style={{ width: "100%" }} readOnly />);
		this.manager.showWindow(window);
	}

	public close() {
		super.close();

		this._recorder.isRecording = false;
		this._recorder.engine = null;
		this._gameController.engine.inputManager = this._recorder.implementation;
		this._gameController.engine.inputManager.engine = this._gameController.engine;
	}

	public set gameController(c) {
		this._gameController = c;
		this._recorder = new RecordingInputManager(c.engine.inputManager as DesktopInputManager);
		c.engine.inputManager = this._recorder;
		c.engine.inputManager.engine = c.engine;
	}

	public get gameController() {
		return this._gameController;
	}

	public set state(s: Storage) {
		this._state = s;
	}

	public get state() {
		return this._state;
	}
}

export default InputRecorder;
