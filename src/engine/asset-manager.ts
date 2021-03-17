interface AssetType<T> {
	new (...args: any[]): T;
}

type MissingEntityHandler<T> = (type: AssetType<T>, id?: number) => T;
const NullIfMissing = (): null => null;
const ThrowIfMissing = <T>(type: AssetType<T>, id: number = null): never => {
	throw new Error(`Entity ${id} of type ${type} cannot be found`);
};

class AssetManager {
	private entries = new Map();

	public get<T>(
		type: AssetType<T>,
		id: number = null,
		missingHandler: MissingEntityHandler<T> = ThrowIfMissing
	): T {
		const entries = this.entries.get(type);
		if (!entries) throw new Error(`Type ${type} is not registered`);
		return entries[id] || missingHandler(type, id);
	}

	public set<T>(type: AssetType<T>, object: T, id: number = null): void {
		let entries = this.entries.get(type);
		if (!entries) {
			this.entries.set(type, []);
			entries = this.entries.get(type);
		}

		entries[id] = object;
	}

	public find<T>(type: AssetType<T>, predicate: (candidate: T) => boolean): T {
		const entries = this.entries.get(type) || [];
		return entries.find(predicate);
	}

	public getFiltered<T>(type: AssetType<T>, predicate: (candidate: T) => boolean): T[] {
		const entries = this.entries.get(type) || [];
		return entries.filter(predicate);
	}

	public getAll<T>(type: AssetType<T>): T[] {
		return this.entries.get(type) || [];
	}

	public populate<T>(type: AssetType<T>, objects: T[]): void {
		this.entries.set(type, objects);
	}
}

export { ThrowIfMissing, NullIfMissing };
export default AssetManager;
