describe("WebFun.Extension.Object.each", () => {
	it("extends the Object prototype", () => {
		const object = {};
		expect(typeof object.each).toBe("function");
	});

	it("can be used to enumerate every 'own property' of an object", () => {
		const object = {
			key1: "test",
			key2: "test"
		};
		const keys: any = [];
		const values: any = [];

		object.each((key, value) => {
			keys.push(key);
			values.push(value);
		});

		expect(keys).toEqual(["key1", "key2"]);
		expect(values).toEqual(["test", "test"]);
	});

	it("is protected against stupid prototype modifications", () => {
		(Object.prototype as any).stupidExtension = true;

		const object = {};
		const keys: any = [];
		const values: any = [];

		object.each((key, value) => {
			keys.push(key);
			values.push(value);
		});

		expect(keys).toEqual([]);
		expect(values).toEqual([]);

		delete (Object.prototype as any).stupidExtension;
	});
});
