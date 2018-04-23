import ParseError from "./parse-error";
import { InputStream } from "src/util";
import RawData from "./raw-data";

export const parseEndOfFile = (stream: InputStream, data: RawData, error: ParseError) => {
	const value = stream.getUint32();
};
