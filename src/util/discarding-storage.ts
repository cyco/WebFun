import { has, load, store } from "src/extension/storage";

class DiscardingStorage implements Storage {
	public readonly has = has;
	public readonly load = load;
	public readonly store = store;

	public length: number = 0;
	[key: string]: any;
	[index: number]: string;

	clear() {}

	getItem(_: string): string | null {
		return null;
	}

	key(_: number): string | null {
		return null;
	}

	removeItem(_: string): void {}

	setItem(_: string, __: string): void {}

	prefixedWith(_: string): Storage {
		return this;
	}
}

export default DiscardingStorage;
