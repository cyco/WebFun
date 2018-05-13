import { Window, ProgressIndicator } from "src/ui/components";
import {
	ManualDataFileReader,
	GameData,
	ColorPalette,
	GameTypeYoda,
	GameTypeIndy
} from "src/engine";
import { InputStream, PromiseProgress } from "src/util";
import { PaletteProvider } from "src/app/data";
import DataManager from "./data-manager";
import CSSTileSheet from "./css-tile-sheet";
import { ImageFactory } from "src/engine/rendering/canvas";
import "./editor-window.scss";

class EditorWindow extends Window {
	static readonly TagName = "wf-resource-editor-window";
	title: string = "Resource Editor";
	private _progressIndicator: HTMLElement = <ProgressIndicator />;
	private _editorView: HTMLElement = <div /> as HTMLElement;

	connectedCallback() {
		super.connectedCallback();
		this.content.appendChild(this._progressIndicator);
	}

	public async loadFile(file: File) {
		const stream = await file.provideInputStream();
		const type = file.name.toLowerCase().indexOf("yod") === -1 ? GameTypeIndy : GameTypeYoda;
		const rawData = ManualDataFileReader(stream, type);
		const data = new GameData(rawData);
		const palette = await new PaletteProvider().provide(type);
		const tileSheet = new CSSTileSheet(data.tiles.length);
		data.tiles.forEach(t => tileSheet.add(t.imageData));
		tileSheet.draw(new ImageFactory(palette));
	}
}

export default EditorWindow;
