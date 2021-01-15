import { has, load, store } from "src/extension/storage";

class PrefixedStorage implements Storage {
	private _prefix: string;
	private _storage: Storage;

	public readonly has = has;
	public readonly load = load;
	public readonly store = store;

	public length: number = 0;
	[key: string]: any;
	[index: number]: string;

	constructor(backing: Storage, prefix: string) {
		this._storage = backing;
		this._prefix = prefix;
	}

	public prefixedWith(prefix: string): PrefixedStorage {
		return new PrefixedStorage(this._storage, this._buildKey(prefix));
	}

	clear(): void {}

	getItem(key: string): string | null {
		return this._storage.getItem(this._buildKey(key));
	}

	key(_: number): string | null {
		return null;
	}

	removeItem(key: string): void {
		this._storage.removeItem(this._buildKey(key));
	}

	setItem(key: string, data: string): void {
		this._storage.setItem(this._buildKey(key), data);
	}

	private _buildKey(key: string): string {
		return `${this.prefix}.${key}`;
	}

	get prefix(): string {
		return this._prefix;
	}
}

export default PrefixedStorage;
