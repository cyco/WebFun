import { default as PromiseProxy, Resolve, Reject } from "./promise-proxy";

type Progress = (v: number) => void;
type Executor<T> = (resolve: Resolve<T>, reject: Reject, progress: Progress) => void;

export class PromiseProgress<T> extends PromiseProxy<T> {
	private _progress: Progress[];
	constructor(callback: Executor<T>) {
		super((resolve, reject) => {
			callback(resolve, reject, (h: number) => {
				this._progress = this._progress || [];
				this._progress.forEach(progress => progress(h));
			});
		});
	}

	public progress(callback: Progress) {
		this._progress = this._progress || [];
		this._progress.push(callback);
	}
}

export default PromiseProgress;
export { Resolve, Reject, Executor, Progress };
