import { InputStream } from "src/util";
import { Data } from "../types";

export const parseVersion = (stream: InputStream, data: Data): void => {
	data.version = stream.getUint32();
};
