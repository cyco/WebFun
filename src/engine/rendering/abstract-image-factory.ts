import ColorPalette from "./color-palette";
import Image from "./image";

abstract class AbstractImageFactory {
	public palette: ColorPalette;
	public onpalettechange: Function;

	abstract buildImage(width: number, height: number, pixelData: Uint8Array): Promise<Image>;

	prepare(_: number) {}

	finalize() {}
}

export default AbstractImageFactory;
