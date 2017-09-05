import { srand } from "src/util";

describe("Array.shuffle", () => {
	it("extends the Array prototype", () => {
		let array = [];
		expect(typeof array.shuffle).toBe("function");
	});

	xit("wildly shuffles the elements of an array around using our custom prng", () => {
		let array;

		srand(0);
		array = ["a", "b", "c"];
		array.shuffle();
		expect(array).toEqual(["b", "c", "a"]);

		srand(0x1234);
		array = ["a", "b", "c"];
		array.shuffle();
		expect(array).toEqual(["c", "a", "b"]);

		srand(0);
		array = ["a", "b", "c"];
		array.shuffle();
		expect(array).toEqual(["b", "c", "a"]);
	});

	it("doesn't do anything on empty arrays", () => {
		const array = [];
		array.shuffle();

		expect(array.length).toBe(0);
	});

	it("modifies the array in place and also modified the modified array", () => {
		const thing = [1, 2, 3];
		expect(thing.shuffle()).toBe(thing);
	});
});
