type Class = { new (...args: any[]): any };

class ServiceContainer {
	private static _default = new ServiceContainer();
	private _services = new Map<any, any>();

	static get default(): ServiceContainer {
		return this._default;
	}

	public register<T extends Class>(c: T, o: InstanceType<T>): void {
		this._services.set(c, o);
	}

	get<T extends Class>(c: T): InstanceType<T> {
		return this._services.get(c);
	}

	public unregister<T extends Class>(c: T, _: InstanceType<T>): void {
		this._services.delete(c);
	}
}

export default ServiceContainer;
