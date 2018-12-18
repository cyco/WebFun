import CompressedColorPalette from "./compressed-color-palette";
import Image from "./image";

abstract class AbstractImageFactory {
	public palette: CompressedColorPalette;
	public onpalettechange: Function;

	abstract buildImage(width: number, height: number, pixelData: Uint8Array): Promise<Image>;

	prepare(_: number) {}

	finalize() {}
}

export default AbstractImageFactory;
