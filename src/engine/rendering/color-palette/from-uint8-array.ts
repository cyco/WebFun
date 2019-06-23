import ColorPalette from "./color-palette";

function paletteFromUint8Array(arr: Uint32Array): ColorPalette {
	const colorPalette = new Uint32Array(0x100) as ColorPalette;

	for (let i = 0; i < 0x100; i++) {
		colorPalette[i] =
			((i === 0 ? 0 : 0xff) << 24) | // alpha
			(arr[i * 4 + 0] << 16) | // blue
			(arr[i * 4 + 1] << 8) | // green
			arr[i * 4 + 2]; // red
	}

	return colorPalette;
}

export default paletteFromUint8Array;
