import ParseError from "./parse-error";
import { InputStream } from "src/util";
import RawData from "./raw-data";

export const parseSounds = (stream: InputStream, data: RawData, error: ParseError) => {
	let size = stream.getUint32();
	let count = -stream.getInt16();
	for (let i = 0; i < count; i++) {
		let size = stream.getUint16();
		let name = stream.getCharacters(size);
		// ISO_8859_1.decode(&buffer, DecoderTrap::Strict);
	}
};
