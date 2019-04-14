import { InputStream } from "src/util";
import { assert } from "../error";

export const parseSetupImage = (stream: InputStream, data: any) => {
	const size = stream.getUint32();
	assert(size === 288 * 288, `Expected setup image to be 288x288 pixels in size.`, stream);
	data.setup = stream.getUint8Array(size);
};
