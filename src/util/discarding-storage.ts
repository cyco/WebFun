import { has, load, store } from "src/extension/storage";

class DiscardingStorage implements Storage {
	public readonly has = has;
	public readonly load = load;
	public readonly store = store;

	public length: number = 0;
	[key: string]: any;
	[index: number]: string;

	constructor() {
	}

	clear() {
	};

	getItem(key: string): string|null {
		return null;
	}

	key(index: number): string|null {
		return null;
	}

	removeItem(key: string): void {
	}

	setItem(key: string, data: string): void {
	}

	prefixedWith(s: string): Storage {
		return this;
	}
}

export default DiscardingStorage;
