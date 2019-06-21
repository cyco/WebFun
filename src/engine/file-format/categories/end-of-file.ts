import { InputStream } from "src/util";
import { Data } from "../types";

export const parseEndOfFile = (stream: InputStream, data: Data) => {
	data.end = stream.getUint32();
};
