import ParseError from "../parse-error";
import { InputStream } from "src/util";

export const parseNPC = (stream: InputStream) => {
	let character = stream.getUint16();
	let x = stream.getUint16();
	let y = stream.getUint16();
	let unknown1 = stream.getUint16();
	let unknown2 = stream.getUint32();

	let unknown = stream.getUint8Array(0x20);

	return { character, x, y, unknown1, unknown2, unknown };
};
