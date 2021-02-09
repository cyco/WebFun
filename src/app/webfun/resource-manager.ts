import ResourceManagerInterface from "src/engine/resource-manager";
import { ColorPalette } from "src/engine/rendering";
import { encodeURIComponent } from "src/std";
import { FileLoader, InputStream } from "src/util";

class ResourceManager implements ResourceManagerInterface {
	private _paletteURL: string;
	private _dataURL: string;
	private _soundBaseURL: string;

	constructor(palette: string, data: string, soundBase: string) {
		this._paletteURL = palette;
		this._dataURL = data;
		this._soundBaseURL = soundBase;
	}

	async loadPalette(progress: (progress: number) => void): Promise<ColorPalette> {
		const stream = await FileLoader.loadAsStream(this._paletteURL, progress);
		return ColorPalette.FromBGR8(stream.readUint8Array(0x400));
	}

	loadGameFile(progress: (progress: number) => void): Promise<InputStream> {
		return FileLoader.loadAsStream(this._dataURL, progress);
	}

	loadSound(name: string, _progress: (progress: number) => void): Promise<ArrayBuffer> {
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
			request.onload = () => resolve(request.response);
			request.send();
		});
	}
}

export default ResourceManager;
