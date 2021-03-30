import ResourceManagerInterface from "src/engine/resource-manager";
import { ColorPalette } from "src/engine/rendering";
import { encodeURIComponent } from "src/std";
import { FetchInputStream, FileLoader, ReaderStream } from "src/util";

class ResourceManager implements ResourceManagerInterface {
	private _paletteURL: string;
	private _dataURL: string;
	private _soundBaseURL: string;
	private _stringsURL: string;

	constructor(palette: string, data: string, strings: string, soundBase: string) {
		this._paletteURL = palette;
		this._dataURL = data;
		this._stringsURL = strings;
		this._soundBaseURL = soundBase;
	}

	async loadPalette(progress: (progress: number) => void): Promise<ColorPalette> {
		const stream = await FileLoader.loadAsStream(this._paletteURL, progress);
		return ColorPalette.FromBGR8(stream.readUint8Array(0x400));
	}

	async loadGameFile(progress: (progress: number) => void): Promise<ReaderStream> {
		const response = await fetch(this._dataURL);

		const stream = new FetchInputStream(response, { expectedSize: 4_500_000 });
		stream.onprogress = () => progress(stream.bytesAvailable / stream.bytesTotal);
		return stream;
	}

	loadSound(name: string, progress: (progress: number) => void): Promise<ArrayBuffer> {
		return new Promise((resolve, reject) => {
			// Indy games use a full (Windows) path instead of just the file name so we have to remove it
			const fileName = name
				.split(/[\/\\]/)
				.last()
				.toLowerCase();
			const url = this._soundBaseURL.ensureTail("/") + encodeURIComponent(fileName + ".mp3");
			const request = new XMLHttpRequest();
			request.open("GET", url);
			request.responseType = "arraybuffer";
			request.onerror = reject;
			request.onprogress = (e: ProgressEvent) => {
				if (!e.lengthComputable) return;
				progress(e.loaded / e.total);
			};
			request.onload = () => resolve(request.response);
			request.send();
		});
	}

	async loadStrings(progress: (progress: number) => void): Promise<{ [_: number]: string }> {
		if (!this._stringsURL || this._stringsURL.length === 0) {
			return Promise.resolve({});
		}

		return new Promise((resolve, reject) => {
			const request = new XMLHttpRequest();
			request.open("GET", this._stringsURL);
			request.responseType = "json";
			request.onerror = reject;
			request.onprogress = (e: ProgressEvent) => {
				if (!e.lengthComputable) return;
				progress(e.loaded / e.total);
			};
			request.onload = () => resolve(request.response);
			request.send();
		});
	}
}

export default ResourceManager;
