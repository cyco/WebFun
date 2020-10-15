import "./input-recorder.scss";

import { Component, WindowManager } from "src/ui";
import { IconButton, Window } from "src/ui/components";

import { InputManager as AppInputManager } from "src/app/input";
import { GameController } from "src/app";
import { RecordingInputManager } from "src/debug/automation";

class InputRecorder extends Component {
	public static readonly tagName = "wf-debug-input-recorder";
	private _gameController: GameController = null;
	private _recorder: RecordingInputManager = null;

	private _record = (
		<IconButton style={{ color: "red" }} icon="circle" onclick={() => this.toggleRecording()} />
	) as IconButton;
	private _dump = (<IconButton icon="print" onclick={() => this.showLog()} />);
	private _clear = (<IconButton icon="ban" onclick={() => this._recorder.clearRecords()} />) as IconButton;

	protected connectedCallback(): void {
		super.connectedCallback();

		this.appendChild(this._record);
		this.appendChild(this._clear);
		this.appendChild(this._dump);

		this.toggleRecording();
	}

	protected disconnectedCallback(): void {
		this._recorder.isRecording = false;
		this._recorder.engine = null;
		this._gameController.engine.inputManager = this._recorder.implementation;
		this._gameController.engine.inputManager.engine = this._gameController.engine;

		super.disconnectedCallback();
	}

	public toggleRecording(): void {
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
		const window = (
			<Window title="Recorded Input" autosaveName="input-recorder.output" closable={true} />
		) as Window;
		window.content.style.width = "320px";
		window.content.style.height = "270px";
		window.content.appendChild(<textarea value={this.input} style={{ width: "100%" }} readOnly />);
		WindowManager.defaultManager.showWindow(window);
	}

	public get input(): string {
		return this._recorder.records.join(" ");
	}

	public set input(i: string) {
		this._recorder.records = i.split(" ");
	}

	public set gameController(c: GameController) {
		this._gameController = c;
		this._recorder = new RecordingInputManager(c.engine.inputManager as AppInputManager);
		c.engine.inputManager = this._recorder;
		c.engine.inputManager.engine = c.engine;
	}

	public get gameController(): GameController {
		return this._gameController;
	}
}

export default InputRecorder;
