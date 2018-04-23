import ParseError from "./parse-error";
import { InputStream } from "src/util";
import RawData from "./raw-data";

export const parseVersion = (stream: InputStream) => {
	let version = stream.getUint32();
};
