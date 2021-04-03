import ResourceManagerInterface from "src/engine/resource-manager";
import { ColorPalette } from "src/engine/rendering";
import { encodeURIComponent } from "src/std";
import { FetchInputStream, FileLoader, InputStream, ReaderStream } from "src/util";
import { Section } from "./portable-executable/portable-executable";
import DataSectionPaletteExtractor from "./data-section-palette-extractor";
import {
	PortableExecutableParser,
	ResourceSectionParser,
	ResourceType,
	StringResourceParser
} from "./portable-executable";

class ResourceManager implements ResourceManagerInterface {
	private _dataURL: string;
	private _soundBaseURL: string;
	private _soundFormat: string;
	private _sections: Section[];
	private _exeStream: InputStream;
	private _exeURL: string;

	constructor(exe: string, data: string, soundBase: string, soundFormat: string) {
		this._exeURL = exe;
		this._dataURL = data;
		this._soundBaseURL = soundBase;
		this._soundFormat = soundFormat;
	}

	async loadPalette(progress: (progress: number) => void): Promise<ColorPalette> {
		const sections = await this.loadSections(progress);
		const dataSection = sections.find(s => s.name === ".data");
		const extractor = new DataSectionPaletteExtractor();
		const paletteData = extractor.extractPalette(dataSection, this._exeStream);

		return ColorPalette.FromBGR8(paletteData);
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
				.toLowerCase()
				.replace(/\.(wav|mid|midi)/g, "");
			const url = this._soundBaseURL + encodeURIComponent(`${fileName}.${this._soundFormat}`);
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
		const sections = await this.loadSections(progress);
		const resourceSection = sections.find(s => s.name === ".rsrc");
		const resourceSectionParser = new ResourceSectionParser();
		const resources = resourceSectionParser.parse(resourceSection, this._exeStream);
		const stringResourceParser = new StringResourceParser();

		return resources
			.filter(r => r.type === ResourceType.RT_STRING)
			.map(rsrc => stringResourceParser.parse(rsrc, resourceSection, this._exeStream))
			.reduce((prev, val) => Object.assign(prev, val), {});
	}

	private async loadSections(progress: (_: number) => void) {
		if (this._sections) {
			progress(1);
			return this._sections;
		}

		const stream = await FileLoader.loadAsStream(this._exeURL, progress);

		this._exeStream = stream;
		const parser = new PortableExecutableParser();
		const executable = parser.parse(stream);
		this._sections = executable.sections;

		return this._sections;
	}
}

export default ResourceManager;
