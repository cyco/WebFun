import { InputStream } from "src/util";
import ParseError from "./parse-error";

export const error = (message: string | Error | ParseError, _?: InputStream): void => {
	let error: ParseError = null;

	if (message instanceof ParseError) {
		error = message;
	} else if (message instanceof Error) {
		error = new ParseError(message.message);
	} else if (typeof message === "string") {
		error = new ParseError(message);
	} else {
		error = new ParseError("Unknown error");
	}

	throw error;
};

export const assert = (condition: boolean, err: string | Error, stream: InputStream): void => {
	if (!condition) error(err, stream);
};

export default error;
