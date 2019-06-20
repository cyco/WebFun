interface AssetConstructor<T> {
	new (...args: any[]): T;
}

type MissingEntityHandler = <T>(type: AssetConstructor<T>, id?: number) => T;
const NullIfMissing = (): null => null;
const ThrowIfMissing = <T>(type: AssetConstructor<T>, id: number = null) => {
	throw new Error(`Entity ${id} of type ${type} cannot be found`);
};

class AssetManager {
	private entries = new Map();

	public get<T>(
		type: AssetConstructor<T>,
		id: number = null,
		missingHandler: MissingEntityHandler = ThrowIfMissing
	): T {
		const entries = this.entries.get(type);
		if (!entries) throw new Error(`Type ${type} is not registed`);
		return entries[id] || missingHandler(type, id);
	}

	public set<T>(type: AssetConstructor<T>, object: T, id: number = null): void {
		let entries = this.entries.get(type);
		if (!entries) {
			this.entries.set(type, []);
			entries = this.entries.get(type);
		}

		entries[id] = object;
	}

	public populate<T>(type: AssetConstructor<T>, objects: T[]): void {
		this.entries.set(type, objects);
	}
}

export { ThrowIfMissing, NullIfMissing };
export default AssetManager;
