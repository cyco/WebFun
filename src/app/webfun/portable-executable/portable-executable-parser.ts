import { InputStream } from "src/util";
import { PortableExecutable } from "./portable-executable";

export class PortaleExecutableFileFormatError extends Error {}

class PortableExecutableParser {
	public parse(stream: InputStream): PortableExecutable {
		const mzHeader = this.readMZ(stream);
		stream.seek(mzHeader.peHeaderOffset, InputStream.Seek.Set);

		const coff = this.readPEHeader(stream) as any;
		this.skipPastOptionalHeader(stream, coff.sizeOfOptionalHeader);
		const sections = this.readSections(stream, coff.numberOfSections);

		return { mz: mzHeader, coff: coff, sections: sections };
	}

	private readMZ(stream: InputStream) {
		const magic = stream.readCharacters(2) as "MZ";
		if (magic !== "MZ") {
			throw new PortaleExecutableFileFormatError("File does not contain a valid MZ header.");
		}

		const data = stream.readUint8Array(0x3a);
		const peHeaderOffset = stream.readUint32();

		return { magic, data, peHeaderOffset };
	}

	private readPEHeader(stream: InputStream) {
		const magic = stream.readCharacters(2);
		if (magic !== "PE") {
			throw new PortaleExecutableFileFormatError("File does not contain a valid PE header");
		}

		const reserved1 = stream.readUint16();
		console.assert(reserved1 === 0);

		return this.readCoffHeader(stream);
	}

	private readCoffHeader(stream: InputStream) {
		const machine = stream.readUint16();
		const numberOfSections = stream.readUint16();
		const timeDateStamp = stream.readUint32();
		const pointerToSymbolTable = stream.readUint32();
		const numberOfSymbols = stream.readUint32();
		const sizeOfOptionalHeader = stream.readUint16();
		const characteristics = stream.readUint16();

		return {
			machine,
			numberOfSections,
			timeDateStamp,
			pointerToSymbolTable,
			numberOfSymbols,
			sizeOfOptionalHeader,
			characteristics
		};
	}

	private skipPastOptionalHeader(stream: InputStream, size: number) {
		stream.seek(size, InputStream.Seek.Cur);
	}

	private readSections(stream: InputStream, count: number) {
		const sections = [];
		for (let i = 0; i < count; i++) {
			sections.push(this.readSection(stream));
		}

		return sections;
	}

	private readSection(stream: InputStream) {
		const name = stream.readCStringWithLength(8);
		const virtualSize = stream.readUint32();
		const virtualAddress = stream.readUint32();
		const bodySize = stream.readUint32();
		const bodyOffset = stream.readUint32();
		const relocationsOffset = stream.readUint32();
		const lineNumbersOffset = stream.readUint32();
		const relocationCount = stream.readUint16();
		const lineNumbersCount = stream.readUint16();
		const characteristics = stream.readUint32();

		return {
			name,
			virtualSize,
			virtualAddress,
			bodySize,
			bodyOffset,
			lineNumbersOffset,
			lineNumbersCount,
			relocationsOffset,
			relocationCount,
			characteristics
		};
	}
}

export default PortableExecutableParser;
