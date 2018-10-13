import { InputStream } from "src/util";

export const parseEndOfFile = (stream: InputStream, data: any) => {
	data.end = stream.getUint32();
};
