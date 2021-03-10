import { InputStream } from "src/util";

export const parseTgen = (stream: InputStream): void => {
	const size = stream.readUint32();
	stream.readUint8Array(size);
	// TODO: use tgen data
};
