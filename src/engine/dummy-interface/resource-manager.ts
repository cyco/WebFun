import { InputStream, FileLoader } from "src/util";
import ResourceManagerInterface from "src/engine/resource-manager";
import { ColorPalette } from "src/engine/rendering";
import { encodeURIComponent } from "src/std";

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
		return ColorPalette.FromBGR8(stream.getUint8Array(0x400));
	}

	loadGameFile(progress: (progress: number) => void): Promise<InputStream> {
		return FileLoader.loadAsStream(this._dataURL, progress);
	}

	loadSound(name: string, progress: (progress: number) => void): Promise<InputStream> {
		return FileLoader.loadAsStream([this._soundBaseURL, encodeURIComponent(name)].join("/"), progress);
	}
}

export default ResourceManager;
