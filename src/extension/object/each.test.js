describe("Object.each", () => {
	it("extends the Object prototype", () => {
		let object = {};
		expect(typeof object.each).toBe("function");
	});

	it("can be used to enumerate every 'own property' of an object", () => {
		const object = {
			key1: "test",
			key2: "test"
		};
		const keys = [];
		const values = [];

		object.each((key, value) => {
			keys.push(key);
			values.push(value);
		});

		expect(keys).toEqual(["key1", "key2"]);
		expect(values).toEqual(["test", "test"]);
	});
});
