import { ColorPalette } from "src/engine";
import { InputStream, OutputStream, Size } from "src/util";

class Reader {
	public read(s: InputStream): [Size, Uint8Array, ColorPalette] {
		// Bitmap file header
		const magic = s.readCharacters(2);
		if (magic !== "BM") throw "Invalid file format";
		const length = s.readUint32();
		const v1 = s.readUint16();
		if (v1 !== 0) throw "Invalid magic 1";
		const v2 = s.readUint16();
		if (v2 !== 0) throw "Invalid magic 2";
		const bitmapOffset = s.readUint32();

		// DIB header
		const headerSize = s.readUint32();
		if (headerSize !== 12) throw "Invalid header size";
		const width = s.readUint16();
		const height = s.readUint16();
		const v3 = s.readUint16();
		if (v3 !== 1) throw "Invalid magic 3";
		const bps = s.readUint16(); // bits per pixel
		if (bps !== 8) throw "Invalid bits per pixels";

		const paletteData = s.readUint8Array(bitmapOffset - s.offset);
		const palette = ColorPalette.FromRGB8(paletteData);

		const imageDataLength = length - s.offset;
		const imageData = new OutputStream(imageDataLength);
		for (let y = 0; y < height; y++) {
			imageData.seek((height - y - 1) * width, InputStream.Seek.Set);
			imageData.writeUint8Array(s.readUint8Array(width));
		}

		imageData.seek(imageDataLength, InputStream.Seek.Set);

		return [new Size(width, height), new Uint8Array(imageData.buffer), palette];
	}
}

export default Reader;
