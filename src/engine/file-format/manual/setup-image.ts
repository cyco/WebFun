import ParseError from "./parse-error";
import { InputStream } from "src/util";
import RawData from "./raw-data";
import { assert } from "../error";

export const parseSetupImage = (stream: InputStream, data: RawData) => {
	const size = stream.getUint32();
	assert(size == 288 * 288, `Expected setup image to be 288x288 pixels in size.`, stream);
	const pixels = stream.getUint8Array(size);
};
