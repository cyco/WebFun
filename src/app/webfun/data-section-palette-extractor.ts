import { InputStream } from "src/util";
import { Section } from "./portable-executable/portable-executable";

class DataSectionPaletteExtractor {
	public extractFromDataSection(section: Section, stream: InputStream): Uint8Array {
		const marker = new Uint8Array([67, 68, 101, 115, 107, 99, 112, 112, 68, 111, 99, 0]);
		console.assert(section.name === ".data");

		stream.seek(section.bodyOffset, InputStream.Seek.Set);
		return this.extractFromMarker(marker, 0, stream, section.bodySize);
	}

	public extractFromBinary(stream: InputStream): Uint8Array {
		const marker = new Uint8Array([115, 115, 115]);
		stream.seek(0, InputStream.Seek.Set);

		return this.extractFromMarker(marker, -103, stream, stream.length);
	}

	private extractFromMarker(
		marker: Uint8Array,
		offset: number,
		stream: InputStream,
		maxSize: number
	) {
		const data = stream.readUint8Array(maxSize);

		outer: for (let i = 0; i < data.byteLength; i++) {
			for (let j = 0; j < marker.byteLength; j++) if (data[i + j] !== marker[j]) continue outer;

			return data.slice(i + marker.length + offset, i + marker.length + offset + 0x400);
		}

		throw new Error("Could not find color palette in binary stream.");
	}
}

export default DataSectionPaletteExtractor;
