import CharType from "src/engine/objects/char-type";

describe("WebFun.Engine.Objects.CharType", () => {
	it("can be created from a number", () => {
		expect(CharType.fromNumber(1)).toBe(CharType.Hero);
		expect(() => CharType.fromNumber(0)).toThrow();
	});

	it("has a number representation", () => {
		expect(CharType.Hero.rawValue).toBe(1);
	});

	it("defines names for all known types", () => {
		expect(CharType.Hero.name).toBe("Hero");
		expect(CharType.Enemy.name).toBe("Enemy");
		expect(CharType.Weapon.name).toBe("Weapon");

		spyOn(console, "assert");
		new CharType().name;
		expect(console.assert).toHaveBeenCalled();
	});

	it("has a custom string representation", () => {
		expect(CharType.Hero.toString()).toBe("CharType{Hero}");
	});
});
