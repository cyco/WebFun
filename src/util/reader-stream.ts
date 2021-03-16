import { max } from "src/std/math";
import InputStream from "./input-stream";

type ReaderStreamOptions = {
	expectedSize: number;
	reallocStrategy: (requestedBytes: number, alreadyAllocated: number) => number;
};

const DefaultOptions: ReaderStreamOptions = {
	expectedSize: 1_000_000,
	reallocStrategy: (k, n) => max(n * 2, k + n)
};

class ReaderStream extends InputStream {
	public static readonly DefaultOptions = DefaultOptions;

	public onload: Function;
	public onprogress: Function;
	public onerror: Function;

	private _options: ReaderStreamOptions;
	private total: number;
	private loaded: number;
	private _error: Error;
	private _reader: ReadableStreamReader<Uint8Array>;
	private _bufferView: Uint8Array;

	public static isSupported(): boolean {
		return "ReadableStream" in window;
	}

	public constructor(
		reader: ReadableStreamReader<Uint8Array>,
		options: Partial<ReaderStreamOptions> = {}
	) {
		const opts = Object.assign({}, DefaultOptions, options);
		super(new ArrayBuffer(opts.expectedSize));

		this.loaded = 0;
		this.total = opts.expectedSize;
		this._error = null;
		this.onload = null;
		this.onprogress = null;
		this.onerror = null;

		this._bufferView = new Uint8Array(this.arrayBuffer);
		this._options = opts;
		this._reader = reader;
		this.read();
	}

	private async read(): Promise<void> {
		try {
			const { done, value } = await this._reader.read();
			if (done) {
				this._reader = null;
				this.total = this.loaded;
				if (this.onload) this.onload();
				return;
			}

			this.append(value);
			if (this.onprogress) this.onprogress();

			this.read();
		} catch (e) {
			this._reader = null;
			this._error = e;

			if (this.onerror) this.onerror();
		}
	}

	private append(value: Uint8Array): void {
		const remainingBytes = this.arrayBuffer.byteLength - (this.loaded + value.byteLength);
		if (remainingBytes < 0) this.realloc(-remainingBytes);

		this._bufferView.set(value, this.loaded);

		this.loaded += value.byteLength;
		this.total = max(this.total, this.loaded);
	}

	private realloc(requestedBytes: number) {
		const size = this._options.reallocStrategy(requestedBytes, this.arrayBuffer.byteLength);
		const buffer = new ArrayBuffer(size);
		const view = new Uint8Array(buffer);

		view.set(this._bufferView, 0);

		this.arrayBuffer = buffer;
		this._bufferView = view;
		this.dataView = new DataView(this.arrayBuffer);
	}

	public cancel(): void {
		this._reader.cancel();
	}

	public get length(): number {
		return this.loaded;
	}

	public get bytesAvailable(): number {
		return this.loaded;
	}

	public get bytesTotal(): number {
		return this.total;
	}

	public get done(): boolean {
		return this._reader === null;
	}

	public get error(): Error {
		return this._error;
	}
}

declare namespace ReaderStream {
	export type Options = ReaderStreamOptions;
}

export default ReaderStream;
