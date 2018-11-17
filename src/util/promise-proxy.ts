import { Promise } from "src/std";

type Resolve<T> = (value?: T | PromiseLike<T>) => void;
type Reject = (reason?: any) => void;
type Executor<T> = (resolve: Resolve<T>, reject: Reject) => void;

class PromiseProxy<T> {
	private _promise: Promise<T>;

	public static resolve<T>(value?: T): PromiseProxy<T> {
		return new this(resolve => resolve(value));
	}

	public static reject<T>(reason?: any): PromiseProxy<T> {
		return new this((_, reject) => reject(reason));
	}

	constructor(executor: Executor<T>) {
		this._promise = new Promise(executor);
	}

	public then(onfulfilled?: (value: T) => void | T | PromiseLike<T>): Promise<T> {
		return this._promise.then(<any>onfulfilled);
	}

	public async catch(onrejected?: (reason: any) => PromiseLike<never>): Promise<T> {
		return this._promise.catch(onrejected);
	}
}

export default PromiseProxy;
export { Resolve, Reject, Executor };
