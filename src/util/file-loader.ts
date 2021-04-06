import EventTarget from "./event-target";
import InputStream from "./input-stream";

export const Event = {
	Start: "start",
	Progress: "progress",
	Load: "load",
	Fail: "fail"
};

export type FileLoaderOptions = {
	expectedSize: number;
};

const FileLoaderDefaultOptions = {
	expectedSize: Infinity
};

class FileLoader extends EventTarget {
	public onfail: (_: CustomEvent) => void;
	public onprogress: (_: CustomEvent) => void;
	public onload: (_: CustomEvent) => void;
	private _path: string;
	private _options: FileLoaderOptions;

	public static async loadAsStream(
		path: string,
		progress?: (p: number) => void,
		options: Partial<FileLoaderOptions> = {}
	): Promise<InputStream> {
		return new Promise<InputStream>((resolve, reject) => {
			const loader = new this(path, options);
			loader.onload = (e: any) => resolve(e.detail.stream);
			loader.onfail = reject;
			if (progress)
				loader.addEventListener(Event.Progress, (e: any) => progress(e.detail.progress));
			loader.load();
		});
	}

	constructor(path: string, options: Partial<FileLoaderOptions>) {
		super();
		this._path = path;
		this._options = Object.assign({}, FileLoaderDefaultOptions, options);
	}

	public load(): void {
		const reader = new XMLHttpRequest();
		reader.open("GET", this._path, true);
		reader.responseType = "arraybuffer";

		this._didProgress(0);

		reader.onload = ({ target }) => this._didLoad(target as XMLHttpRequest);
		reader.onerror = event => this._didFail(event);
		reader.onprogress = (e: any) =>
			this._didProgress(e.loaded / (e.total === 0 ? this._options.expectedSize : e.total));
		reader.send(void 0);

		this.dispatchEvent(Event.Start);
	}

	private _didLoad(reader: XMLHttpRequest) {
		if (reader.status >= 300) {
			return this._didFail(new ErrorEvent("error", { error: reader.status }));
		}

		this._didProgress(1);

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
