import Scanner from "src/util/scanner";

describe("WebFun.Util.Scanner", () => {
	let subject: Scanner;

	it("is a class used in string parsing", () => {
		expect(Scanner).toBeAClass();
	});

	beforeEach(() => {
		subject = new Scanner("inp   ut.test");
	});

	describe("method peek", () => {
		it("is used to get the current character without chaning the offset", () => {
			expect(subject.peek()).toBe("i");
			expect(subject.peek()).toBe("i");
			expect(subject.peek()).toBe("i");
		});
	});

	describe("method poke", () => {
		it("returns the current character and advances the offset", () => {
			expect(subject.poke()).toBe("i");
			expect(subject.poke()).toBe("n");
			expect(subject.poke()).toBe("p");
		});
	});

	describe("method skipWhitespace", () => {
		it("skips over whitespace characters", () => {
			subject = new Scanner(" \t\r\ntest");
			subject.skipWhitespace();

			expect(subject.peek()).toBe("t");
		});
	});

	describe("method isAtWhitespace", () => {
		it("returns true if current character is whitespace", () => {
			subject = new Scanner("\t");
			expect(subject.isAtWhitespace()).toBeTrue();

			subject = new Scanner(" ");
			expect(subject.isAtWhitespace()).toBeTrue();

			subject = new Scanner("\n");
			expect(subject.isAtWhitespace()).toBeTrue();

			subject = new Scanner("\r");
			expect(subject.isAtWhitespace()).toBeTrue();
		});

		it("returns false if the current character is not considered whitespace", () => {
			subject = new Scanner("test");
			expect(subject.isAtWhitespace()).toBeFalse();
		});
	});

	describe("method isAtEnd", () => {
		it("returns false if current character is available", () => {
			subject = new Scanner("test");
			expect(subject.isAtEnd()).toBeFalse();
		});

		it("returns true if no more characters are available", () => {
			subject = new Scanner("");
			expect(subject.isAtEnd()).toBeTrue();
		});
	});

	describe("property offset", () => {
		it("keeps track of the current position", () => {
			subject = new Scanner("test");
			expect(subject.offset).toBe(0);
			subject.poke();
			subject.poke();
			expect(subject.offset).toBe(2);
		});
	});

	describe("property rest", () => {
		it("returns all remaining characters", () => {
			subject = new Scanner("test");
			subject.poke();
			subject.poke();

			expect(subject.rest).toBe("st");
		});
	});

	it("works with mutli-byte characters", () => {
		subject = new Scanner("€");
		expect(subject.poke()).toEqual("€");
		expect(subject.offset).toBe(1);
	});

	it("does not honor grapheme clusters ", () => {
		subject = new Scanner("🏳️‍🌈");
		expect(subject.poke()).not.toBe("🏳️‍🌈");
	});
});
