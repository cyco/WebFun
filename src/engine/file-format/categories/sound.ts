import { InputStream } from "src/util";
import { assert } from "../error";

export const parseSounds = (stream: InputStream, data: any) => {
	// skip over size
	stream.getUint32();

	const count = -stream.getInt16();
	const sounds = new Array(count);
	for (let i = 0; i < count; i++) {
		const size = stream.getUint16();
		assert(size > 0, `Expected at least as null byte to terminate an empty string!`, stream);
		sounds[i] = stream.getCStringWithLength(size, "iso-8859-2");
	}
	data.sounds = sounds;
};
