import ColorPalette from "./color-palette";

abstract class AbstractImageFactory {
	public palette: ColorPalette;

	buildImage(width: number, height: number, pixelData: Uint8Array) {
	}
}

export default AbstractImageFactory;
