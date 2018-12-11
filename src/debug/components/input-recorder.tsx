import { AbstractWindow, IconButton } from "src/ui/components";
import { GameController } from "src/app";
import { DiscardingStorage } from "src/util";
import { RecordingInputManager } from "src/debug/automation";
import "./input-recorder.scss";

class InputRecorder extends AbstractWindow {
	public static readonly tagName = "wf-debug-input-recorder";
	private _gameController: GameController = null;
	private _state: Storage = new DiscardingStorage();
	private _recorder: RecordingInputManager = null;

	private _record = (
		<IconButton style={{ color: "red" }} icon="circle" onclick={() => this.toggleRecording()} />
	) as IconButton;
	private _dump = <IconButton icon="print" onclick={() => console.log(this._recorder.dumpRecord())} />;
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

	public set gameController(c) {
		this._gameController = c;
		this._recorder = new RecordingInputManager(c.engine.inputManager);
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
