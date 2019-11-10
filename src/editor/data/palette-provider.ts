import { ColorPalette, GameType, GameTypeIndy, GameTypeYoda } from "src/engine";

import { FileLoader } from "src/util";
import Settings from "src/settings";

const ColorPaletteByteLength = 0x400;

class PaletteProvider {
	private url: Map<GameType, string> = new Map<GameType, string>();

	constructor(yodaUrl: string = Settings.url.yoda.palette, indyUrl: string = Settings.url.indy.palette) {
		this.url.set(GameTypeYoda, yodaUrl);
		this.url.set(GameTypeIndy, indyUrl);
	}

	async provide(type: GameType): Promise<ColorPalette> {
		const url = this.url.get(type);
		const stream = await FileLoader.loadAsStream(url);

		const buffer = stream.readUint8Array(ColorPaletteByteLength);
		return ColorPalette.FromBGR8(buffer);
	}
}

export default PaletteProvider;
