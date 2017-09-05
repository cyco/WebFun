describe("Array.flatten", () => {
	it("it extends the Array prototype", () => {
		let array = [];
		expect(typeof array.flatten).toBe("function");
	});

	it("creates a new array from the elements of the arrays contained", () => {
		let sample = [ [ "a" ], [ "b" ], [ "c", "d" ] ];

		let result = sample.flatten();
		expect(result.length).toBe(4);
		expect(result[ 0 ]).toBe("a");
		expect(result[ 3 ]).toBe("d");
	});

	it("returns an empty array if the original array is empty", () => {
		let sample = [];
		let result = sample.flatten();
		expect(result.length).toBe(0);
	});

	it("works if there are non-array elements", () => {
		let sample = [ [ "a", "b" ], "c" ];
		let result = sample.flatten();
		expect(result.length).toBe(3);
		expect(result[ 2 ]).toBe("c");
	});

	it("only flattens one layer of arrays", () => {
		let sample = [ [ "a", [ "b" ] ], "c" ];
		let result = sample.flatten();
		expect(result.length).toBe(3);
		expect(result[ 1 ]).toEqual([ "b" ]);
	});

	it("leaves the original array untouched", () => {
		let sample = [ [ "a" ] ];
		sample.flatten();
		expect(sample[ 0 ] instanceof Array).toBeTrue();
	});
});
