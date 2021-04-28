import { InputStream } from "src/util";
import { assert } from "../error";
import { Data } from "../types";

export const parseStartupImage = (stream: InputStream, data: Data): void => {
	const size = stream.readUint32();
	assert(size === 288 * 288, `Expected startup image to be 288x288 pixels in size.`, stream);
	data.startup = stream.readUint8Array(size);
};
