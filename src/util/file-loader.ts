import { KaitaiStream } from "src/libs";
import EventTarget from "./event-target";
import InputStream from "./input-stream";

export const Event = {
	Start: "start",
	Progress: "progress",
	Load: "load",
	Fail: "fail"
};

class FileLoader extends EventTarget {
	public onfail: (_: CustomEvent) => void;
	public onprogress: (_: CustomEvent) => void;
	public onload: (_: CustomEvent) => void;
	private _path: string;

	constructor(path: string) {
		super();
		this.registerEvents(Event);
		this._path = path;
	}

	load() {
		let reader = new XMLHttpRequest();
		reader.open("GET", this._path, true);
		reader.responseType = "arraybuffer";

		reader.onload = ({target}) => this._didLoad(target as XMLHttpRequest);
		reader.onerror = (event) => this._didFail(event);
		reader.onprogress = ({loaded, total}) => this._didProgress(loaded / total);
		reader.send(void 0);

		this.dispatchEvent(Event.Start);
	}

	_didLoad(reader: XMLHttpRequest) {
		const stream = new InputStream(reader.response);
		const kaitaiStream = new KaitaiStream(reader.response);
		this.dispatchEvent(Event.Load, {
			stream,
			kaitaiStream,
			arraybuffer: reader.response
		});
	}

	_didFail(event: ErrorEvent) {
		this.dispatchEvent(Event.Fail, {
			reason: event
		});
	}

	_didProgress(progress: number) {
		this.dispatchEvent(Event.Progress, {
			progress: progress
		});
	}
}

export default FileLoader;
