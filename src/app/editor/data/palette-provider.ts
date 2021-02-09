import { ColorPalette, Variant, VariantIndy, VariantYoda } from "src/engine";

import { FileLoader } from "src/util";
import Settings from "src/settings";

const ColorPaletteByteLength = 0x400;

class PaletteProvider {
	private url: Map<Variant, string> = new Map<Variant, string>();

	constructor(
		yodaUrl: string = Settings.url.yoda.palette,
		indyUrl: string = Settings.url.indy.palette
	) {
		this.url.set(VariantYoda, yodaUrl);
		this.url.set(VariantIndy, indyUrl);
	}

	async provide(type: Variant): Promise<ColorPalette> {
		const url = this.url.get(type);
		const stream = await FileLoader.loadAsStream(url);

		const buffer = stream.readUint8Array(ColorPaletteByteLength);
		return ColorPalette.FromBGR8(buffer);
	}
}

export default PaletteProvider;
