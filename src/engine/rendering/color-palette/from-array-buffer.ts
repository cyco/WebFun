import ColorPalette from "./color-palette";

function paletteFromArrayBuffer(buffer: ArrayBuffer): ColorPalette {
	const arr = new Uint8Array(buffer);
	return this.paletteFromUint8Array(arr);
}

export default paletteFromArrayBuffer;
