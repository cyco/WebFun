import "./input-recorder.scss";

import { Component, WindowManager } from "src/ui";
import { IconButton, Window } from "src/ui/components";

import { DesktopInputManager } from "src/app/input";
import { GameController } from "src/app";
import { RecordingInputManager } from "src/debug/automation";

class InputRecorder extends Component {
	public static readonly tagName = "wf-debug-input-recorder";
	private _gameController: GameController = null;
	private _recorder: RecordingInputManager = null;

	private _record = (
		<IconButton style={{ color: "red" }} icon="circle" onclick={() => this.toggleRecording()} />
	) as IconButton;
	private _dump = <IconButton icon="print" onclick={() => this.showLog()} />;
	private _clear = <IconButton icon="ban" onclick={() => this._recorder.clearRecord()} /> as IconButton;

	public connectedCallback() {
		super.connectedCallback();

		this.appendChild(this._record);
		this.appendChild(this._clear);
		this.appendChild(this._dump);

		this.toggleRecording();
	}

	public disconnectedCallback() {
		this._recorder.isRecording = false;
		this._recorder.engine = null;
		this._gameController.engine.inputManager = this._recorder.implementation;
		this._gameController.engine.inputManager.engine = this._gameController.engine;

		super.disconnectedCallback();
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

	private showLog() {
		const result = this._recorder.dumpRecord().join(" ");
		const window = (
			<Window title="Recorded Input" autosaveName="input-recorder.output" closable={true} />
		) as Window;
		window.content.style.width = "320px";
		window.content.style.height = "270px";
		window.content.appendChild(<textarea value={result} style={{ width: "100%" }} readOnly />);
		WindowManager.defaultManager.showWindow(window);
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
}

export default InputRecorder;
