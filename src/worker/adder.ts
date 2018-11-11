class Adder {
	private a: number;
	private b: number;

	async setA(a: number): Promise<void> {
		this.a = a;
		return Promise.resolve(void 0);
	}

	async setB(b: number): Promise<void> {
		this.b = b;
		return Promise.resolve(void 0);
	}

	async add(): Promise<number> {
		if (this.a === undefined) return Promise.reject("A is not set!");
		if (this.b === undefined) return Promise.reject("B is not set!");

		return Promise.resolve(this.a + this.b);
	}
}
export default Adder;
