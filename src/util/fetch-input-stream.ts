import ReaderStream from "./reader-stream";

type FetchInputStreamOptions = ReaderStream.Options;
const DefaultOptions = ReaderStream.DefaultOptions;

class FetchInputStream extends ReaderStream {
	public static readonly DefaultOptions = DefaultOptions;

	public static isSupported(): boolean {
		return "fetch" in window && ReaderStream.isSupported();
	}

	private static determineTotalSize(response: Response): number {
		if (!response.ok) {
			throw Error(response.status + " " + response.statusText);
		}

		if (!response.body) {
			throw Error("ReadableStream not yet supported in this browser.");
		}

		const contentEncoding = response.headers.get("content-encoding");
		const contentLength = response.headers.get(contentEncoding ? "x-file-size" : "content-length");
		if (contentLength === null) {
			return null;
		}

		const total = parseInt(contentLength, 10);
		return isNaN(total) ? null : total;
	}

	public constructor(response: Response, options: Partial<FetchInputStreamOptions> = {}) {
		options = Object.assign({}, DefaultOptions, options);
		options.expectedSize = FetchInputStream.determineTotalSize(response) ?? options.expectedSize;

		super(response.body.getReader(), options);
	}
}

declare namespace FetchInputStream {
	export type Options = FetchInputStreamOptions;
}

export default FetchInputStream;
