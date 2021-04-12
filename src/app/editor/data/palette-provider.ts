import DataSectionPaletteExtractor from "src/app/webfun/data-section-palette-extractor";
import { GameSource } from "src/app/webfun/game-controller";
import PortableExecutableParser, {
	PortaleExecutableFileFormatError
} from "src/app/webfun/portable-executable/portable-executable-parser";
import { ColorPalette, Variant } from "src/engine";
import { FileLoader, InputStream } from "src/util";
import { Indy, IndyDemo, Yoda, YodaDemo } from "src/variant";

class PaletteProvider {
	private sources: GameSource[];

	constructor(games: string = process.env["WEBFUN_GAMES"]) {
		this.sources = JSON.parse(games);
	}

	public async provide(type: Variant): Promise<ColorPalette> {
		const source = this.sources.find(({ variant }) => {
			return (
				((type === Yoda || type === YodaDemo) && (variant === "yoda" || variant === "yoda-demo")) ||
				((type === Indy || type === IndyDemo) && (variant === "indy" || variant === "indy-demo"))
			);
		});
		if (!source)
			throw new Error(
				`Could not find a datasource to load palette for ${
					type === Indy || type === IndyDemo ? "indy" : "yoda"
				} variant.`
			);

		const stream = await FileLoader.loadAsStream(source.exe);
		return this.readPalette(stream);
	}

	async readPalette(stream: InputStream): Promise<ColorPalette> {
		try {
			const parser = new PortableExecutableParser();
			const executable = parser.parse(stream);
			const sections = executable.sections;
			const dataSection = sections.find(s => s.name === ".data");
			const extractor = new DataSectionPaletteExtractor();
			const paletteData = extractor.extractFromDataSection(dataSection, stream);
			return ColorPalette.FromBGR8(paletteData);
		} catch (e) {
			if (!(e instanceof PortaleExecutableFileFormatError)) throw e;

			const extractor = new DataSectionPaletteExtractor();
			const paletteData = extractor.extractFromBinary(stream);
			return ColorPalette.FromBGR8(paletteData);
		}
	}
}

export default PaletteProvider;
