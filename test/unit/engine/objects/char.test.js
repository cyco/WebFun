import Char from "src/engine/objects/char";

describe("Char", () => {
	it("is a class representing character specification", () => {
		let char = new Char();
		expect(char instanceof Char).toBeTrue();
	});
});
