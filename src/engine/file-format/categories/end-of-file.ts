import { InputStream } from "src/util";
import { Data } from "../types";

export const parseEndOfFile = (stream: InputStream, data: Data): void => {
	data.end = stream.readUint32();
};
