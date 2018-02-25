import InputStream from "./input-stream";
import iterate from "./iterate";

type T = InputStream;
class Ajax implements PromiseLike<InputStream> {
	public method: string;
	public url: string;
	public onprogress: ((_: number) => void);
	private _resolve: ((_: T) => void);
	private _reject: ((error: any) => void);
	private xhr: XMLHttpRequest;
	private promise: Promise<T>;
	private headers: { [_: string]: string } = {};

	static Get<T>(url: string, progress: (_: number) => void): Ajax {
		const ajax = new Ajax();
		ajax.url = url;
		ajax.method = "GET";
		ajax.onprogress = progress;

		return ajax.send();
	}

	constructor() {
		this.promise = new Promise<T>((resolve, reject) => {
			this._resolve = resolve;
			this._reject = reject;
		});
	}

	setRequestHeader(headerName: string, headerValue: string) {
		this.headers[headerName] = headerValue;
	}

	then<TResult1, TResult2>(
		onfulfilled?: ((value: InputStream) => PromiseLike<TResult1> | TResult1) | null | undefined,
		onrejected?: ((reason: any) => PromiseLike<TResult2> | TResult2) | null | undefined
	): PromiseLike<TResult1 | TResult2> {
		return this.promise.then(onfulfilled, onrejected);
	}

	send(): this {
		const xhr = new XMLHttpRequest();
		xhr.open(this.method, this.url, true);
		xhr.responseType = "arraybuffer";
		if (this.onprogress instanceof Function) {
			const callback = this.onprogress;
			xhr.onprogress = ({ loaded, total }: ProgressEvent) => callback(loaded / total);
		}

		for (const [header, value] of iterate(this.headers)) {
			xhr.setRequestHeader(header, value);
		}

		xhr.onerror = e => this._reject(e);
		xhr.onload = () => this._resolve(new InputStream(xhr.response));
		xhr.send();
		this.xhr = xhr;
		return this;
	}

	cancel(): void {
		this.xhr.abort();
		this._reject(null);
	}
}

export default Ajax;
