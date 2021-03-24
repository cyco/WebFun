import { ColorPalette, Variant } from "src/engine";
import { Indy, Yoda } from "src/variant";

import { FileLoader } from "src/util";

const ColorPaletteByteLength = 0x400;

class PaletteProvider {
	private url: Map<Variant, string> = new Map<Variant, string>();

	constructor(
		yodaUrl: string = JSON.parse(process.env["WEBFUN_GAMES"])[0].palette,
		indyUrl: string = JSON.parse(process.env["WEBFUN_GAMES"])[4].palette
	) {
		this.url.set(Yoda, yodaUrl);
		this.url.set(Indy, indyUrl);
	}

	async provide(type: Variant): Promise<ColorPalette> {
		const url = this.url.get(type);
		const stream = await FileLoader.loadAsStream(url);

		const buffer = stream.readUint8Array(ColorPaletteByteLength);
		return ColorPalette.FromBGR8(buffer);
	}
}

export default PaletteProvider;
