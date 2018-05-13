import { InputStream } from "src/util";

export const parseVersion = (stream: InputStream, data: any) => {
	data.version = stream.getUint32();
};
