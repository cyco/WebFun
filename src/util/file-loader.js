import EventTarget from "./event-target";
import InputStream from "./input-stream";
import KaitaiStream from "kaitai-struct/KaitaiStream";

export const Event = {
	Start: "start",
	Progress: "progress",
	Load: "load",
	Fail: "fail"
};

export default class extends EventTarget {
	constructor(path) {
		super();
		this.registerEvents(Event);
		this._path = path;
	}

	load() {
		let reader = new FileReader();
		reader = new XMLHttpRequest();
		reader.open("GET", this._path, true);
		reader.responseType = "arraybuffer";

		reader.onload = ({target}) => this._didLoad(target);
		reader.onerror = (event) => this._didFail(event);
		reader.onprogress = ({loaded, total}) => this._didProgress(loaded / total);
		reader.send(void 0);

		this.dispatchEvent(Event.Start);
	}

	_didLoad(reader) {
		const stream = new InputStream(reader.result || reader.response);
		const kaitaiStream = new KaitaiStream(reader.result || reader.response);
		this.dispatchEvent(Event.Load, {
			stream,
			kaitaiStream,
			arraybuffer: reader.result || reader.response
		});
	}

	_didFail(event) {
		this.dispatchEvent(Event.Fail, {
			reason: event
		});
	}

	_didProgress(progress) {
		this.dispatchEvent(Event.Progress, {
			progress: progress
		});
	}
}
