import findColor from "./find-color";
import toGIMP from "./to-gimp";
import toAdobeColorTable from "./to-adobe-color-table";
import paletteFromUint8Array from "./from-uint8-array";
import paletteFromArrayBuffer from "./from-array-buffer";

import ColorPalette from "./color-palette";
const proto = Uint32Array.prototype as ColorPalette;
const constructor = Uint32Array as any;

declare global {
	interface Uint32ArrayConstructor {
		paletteFromUint8Array(bytes: Uint8Array): ColorPalette;
		paletteFromArrayBuffer(buffer: ArrayBuffer): ColorPalette;
	}
}

proto.findColor = proto.findColor || findColor;
proto.toGIMP = proto.toGIMP || toGIMP;
proto.toAdobeColorTable = proto.toAdobeColorTable || toAdobeColorTable;
constructor.paletteFromUint8Array = constructor.paletteFromUint8Array || paletteFromUint8Array;
constructor.paletteFromArrayBuffer = constructor.paletteFromArrayBuffer || paletteFromArrayBuffer;

export { findColor, toGIMP, toAdobeColorTable, paletteFromUint8Array, paletteFromArrayBuffer };
export default ColorPalette;
