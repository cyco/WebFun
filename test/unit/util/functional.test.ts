import { and, equal, greaterThan, lessThan, not, or } from "src/util/functional";

describe("WebFun.Util.functional", () => {
	describe("and", () => {
		it("returns a function that evaluates to true if all inputs evaluate to true", () => {
			const evenp = (n: number) => n % 2 === 0;
			const lessThan5 = (n: number) => n < 5;

			expect(and(evenp, lessThan5)(1)).toBeFalse();
			expect(and(evenp, lessThan5)(2)).toBeTrue();
			expect(and(evenp, lessThan5)(6)).toBeFalse();
		});
	});

	describe("or", () => {
		it("returns a function that evaluates to true if some inputs evaluate to true", () => {
			const evenp = (n: number) => n % 2 === 0;
			const lessThan5 = (n: number) => n < 5;

			expect(or(evenp, lessThan5)(1)).toBeTrue();
			expect(or(evenp, lessThan5)(2)).toBeTrue();
			expect(or(evenp, lessThan5)(7)).toBeFalse();
		});
	});

	describe("not", () => {
		it("returns a function negates the result of the input function", () => {
			const evenp = (n: number) => n % 2 === 0;

			expect(not(evenp)(1)).toBeTrue();
			expect(not(evenp)(2)).toBeFalse();
		});
	});

	describe("equal", () => {
		it("simply wraps the strict equality operator in a callback", () => {
			expect(equal(5, 5)).toBeTrue();
			expect(equal("test", "test")).toBeTrue();

			expect(equal(5, 7)).toBeFalse();
			expect(equal("5", 5)).toBeFalse();
		});
	});

	describe("lessThan", () => {
		it("simply wraps the <  operator in a callback", () => {
			expect(lessThan(5, 6)).toBeTrue();
			expect(lessThan(-1, 0)).toBeTrue();

			expect(lessThan(5, 5)).toBeFalse();
			expect(lessThan(6, 5)).toBeFalse();
		});
	});

	describe("greaterThan", () => {
		it("simply wraps the >  operator in a callback", () => {
			expect(greaterThan(7, 6)).toBeTrue();
			expect(greaterThan(0, -1)).toBeTrue();

			expect(greaterThan(5, 5)).toBeFalse();
			expect(greaterThan(5, 6)).toBeFalse();
		});
	});

	describe("composition", () => {
		it("the functions play nice with each other", () => {
			const evenp = (n: number) => n % 2 === 0;
			const lessThan5 = (n: number) => n < 5;
			const largerThan2 = (n: number) => n > 2;

			const test = and(lessThan5, or(evenp, largerThan2));
			expect(test(1)).toBeFalse();
			expect(test(2)).toBeTrue();
			expect(test(3)).toBeTrue();
			expect(test(4)).toBeTrue();
			expect(test(5)).toBeFalse();
			expect(test(6)).toBeFalse();
		});
	});
});
