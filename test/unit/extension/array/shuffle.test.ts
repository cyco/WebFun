import { srand, rand } from "src/util";

describe("WebFun.Extension.Array.shuffle", () => {
	it("extends the Array prototype", () => {
		const array: any[] = [];
		expect(typeof array.shuffle).toBe("function");
	});

	it("wildly shuffles the elements of an array around using our custom prng", () => {
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
		const array: any[] = [];
		array.shuffle();

		expect(array.length).toBe(0);
	});

	it("consumes a random number if the array contains exactly one element", () => {
		srand(0x1234);
		const array = [5];
		array.shuffle();

		expect(array).toEqual([5]);
		expect(rand()).toBe(0x64bd);
	});

	it("modifies the array in place and also modified the modified array", () => {
		const thing = [1, 2, 3];
		expect(thing.shuffle()).toBe(thing);
	});
});
