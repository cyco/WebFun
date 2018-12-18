interface ColorPalette extends Uint32Array {
	slice(start?: number, end?: number): ColorPalette;
}

export default ColorPalette;
