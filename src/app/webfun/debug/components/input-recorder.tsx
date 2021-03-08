import "./input-recorder.scss";

import { Component, WindowManager } from "src/ui";
import { IconButton, Window } from "src/ui/components";

import { InputManager as AppInputManager } from "src/app/webfun/input";
import { RecordingInputManager } from "src/app/webfun/debug/automation";
import { assemble, parse } from "../automation/input";
import { Engine } from "src/engine";

class InputRecorder extends Component {
	public static readonly tagName = "wf-debug-input-recorder";
	private _engine: Engine = null;
	private _recorder: RecordingInputManager = null;

	private _record = (
		<IconButton style={{ color: "red" }} icon="circle" onclick={() => this.toggleRecording()} />
	) as IconButton;
	private _dump = (<IconButton icon="print" onclick={() => this.showLog()} />);
	private _clear = (
		<IconButton icon="ban" onclick={() => this._recorder.clearRecords()} />
	) as IconButton;

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
		this._engine.inputManager = this._recorder.implementation;
		this._engine.inputManager.engine = this._engine;

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
		return assemble(this._recorder?.records);
	}

	public set input(i: string) {
		this._recorder.records = parse(i);
	}

	public set engine(engine: Engine) {
		this._recorder = new RecordingInputManager(engine.inputManager as AppInputManager);
		engine.inputManager = this._recorder;
		engine.inputManager.engine = engine;
		this._engine = engine;
	}

	public get engine(): Engine {
		return this._engine;
	}
}

export default InputRecorder;
