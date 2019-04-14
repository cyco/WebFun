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

	public static async loadAsStream(path: string): Promise<InputStream> {
		return new Promise<InputStream>((resolve, reject) => {
			const loader = new this(path);
			loader.onload = (e: any) => resolve(e.detail.stream);
			loader.onfail = reject;
			loader.load();
		});
	}

	constructor(path: string) {
		super();
		this.registerEvents(Event);
		this._path = path;
	}

	load() {
		const reader = new XMLHttpRequest();
		reader.open("GET", this._path, true);
		reader.responseType = "arraybuffer";

		reader.onload = ({ target }) => this._didLoad(target as XMLHttpRequest);
		reader.onerror = event => this._didFail(event);
		reader.onprogress = ({ loaded, total }) => this._didProgress(loaded / total);
		reader.send(void 0);

		this.dispatchEvent(Event.Start);
	}

	private _didLoad(reader: XMLHttpRequest) {
		const stream = new InputStream(reader.response);
		this.dispatchEvent(Event.Load, {
			stream,
			arraybuffer: reader.response
		});
	}

	private _didFail(event: ProgressEvent) {
		this.dispatchEvent(Event.Fail, {
			reason: event
		});
	}

	private _didProgress(progress: number) {
		this.dispatchEvent(Event.Progress, {
			progress: progress
		});
	}
}

export default FileLoader;
