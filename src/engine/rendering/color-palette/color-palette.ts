interface ColorPalette extends Uint32Array {
	slice(start?: number, end?: number): ColorPalette;
	findColor(r: number, g: number, b: number, a?: number): number;
	toGIMP(name: string): string;
	toAdobeColorTable(): Uint8Array;
}

export default ColorPalette;
