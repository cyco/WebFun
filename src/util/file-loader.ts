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

	public static async loadAsStream(path: string, progress?: (p: number) => void): Promise<InputStream> {
		return new Promise<InputStream>((resolve, reject) => {
			const loader = new this(path);
			loader.onload = (e: any) => resolve(e.detail.stream);
			loader.onfail = reject;
			if (progress) loader.addEventListener(Event.Progress, (e: any) => progress(e.progress));
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
		if (reader.status >= 300) {
			return this._didFail(new ErrorEvent("error", { error: reader.status }));
		}

		const stream = new InputStream(reader.response);
		this.dispatchEvent(Event.Load, {
			stream,
			arraybuffer: reader.response
		});
	}

	private _didFail(event: ErrorEvent | ProgressEvent) {
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
