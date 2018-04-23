import ParseError from "./parse-error";
import { InputStream } from "src/util";
import RawData from "./raw-data";

export const parseNPC = (stream: InputStream, data: RawData) => {
	let character = stream.getUint16();
	let x = stream.getUint16();
	let y = stream.getUint16();
	let unknown1 = stream.getUint16();
	let unknown2 = stream.getUint32();

	let unknown = stream.getUint8Array(0x20);
};
