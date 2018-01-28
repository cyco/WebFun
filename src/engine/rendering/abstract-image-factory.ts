import ColorPalette from "./color-palette";
import Image from "./image";

abstract class AbstractImageFactory {
	public palette: ColorPalette;
	public onpalettechange: Function;

	abstract buildImage(width: number, height: number, pixelData: Uint8Array): Image;

	prepare(count: number) {}

	finalize() {}
}

export default AbstractImageFactory;
