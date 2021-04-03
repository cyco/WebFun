import { InputStream } from "src/util";
import { Section } from "./portable-executable/portable-executable";

class DataSectionPaletteExtractor {
	public extractPalette(section: Section, stream: InputStream): Uint8Array {
		const marker = new Uint8Array([67, 68, 101, 115, 107, 99, 112, 112, 68, 111, 99, 0]);
		console.assert(section.name === ".data");

		stream.seek(section.bodyOffset, InputStream.Seek.Set);
		const data = stream.readUint8Array(section.bodySize);

		outer: for (let i = 0; i < data.byteLength; i++) {
			for (let j = 0; j < marker.byteLength; j++) if (data[i + j] !== marker[j]) continue outer;

			return data.slice(i + marker.length, i + marker.length + 0x400);
		}

		return null;
	}
}

export default DataSectionPaletteExtractor;
