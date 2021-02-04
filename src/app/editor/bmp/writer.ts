import { ColorPalette } from "src/engine";
import { OutputStream, Size } from "src/util";

class BMPWriter {
	public write(pixels: Uint8Array, palette: ColorPalette, size: Size): ArrayBuffer {
		const length = 14 + 12 + palette.length * 3 + pixels.length;
		const bitmapOffset = 14 + 12 + palette.length * 3;
		const stream = new OutputStream(length);

		// Bitmap file header
		stream.writeCharacters("BM");
		stream.writeUint32(length);
		stream.writeUint16(0);
		stream.writeUint16(0);
		stream.writeUint32(bitmapOffset);

		// DIB header
		stream.writeUint32(12);
		stream.writeUint16(size.width);
		stream.writeUint16(size.height);
		stream.writeUint16(1);
		stream.writeUint16(8); // bits per pixel

		// Color Palette
		// make transparent color stand out
		stream.writeUint8(117);
		stream.writeUint8(20);
		stream.writeUint8(104);

		for (let i = 1; i < palette.length; i++) {
			stream.writeUint8((palette[i] >> 16) & 0xff);
			stream.writeUint8((palette[i] >> 8) & 0xff);
			stream.writeUint8((palette[i] >> 0) & 0xff);
		}

		// Bitmap data
		for (let row = size.height - 1; row >= 0; row--) {
			stream.writeUint8Array(pixels.slice(row * size.width, row * size.width + size.width));
		}

		return stream.buffer;
	}
}

export default BMPWriter;
