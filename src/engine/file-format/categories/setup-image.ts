import { InputStream } from "src/util";
import { assert } from "../error";
import { Data } from "../types";

export const parseSetupImage = (stream: InputStream, data: Data) => {
	const size = stream.readUint32();
	assert(size === 288 * 288, `Expected setup image to be 288x288 pixels in size.`, stream);
	data.setup = stream.readUint8Array(size);
};
