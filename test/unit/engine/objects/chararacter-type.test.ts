import CharacterType from "src/engine/objects/character-type";

describe("WebFun.Engine.Objects.CharacterType", () => {
	it("can be created from a number", () => {
		expect(CharacterType.fromNumber(1)).toBe(CharacterType.Hero);
		expect(() => CharacterType.fromNumber(0)).toThrow();
	});

	it("has a number representation", () => {
		expect(CharacterType.Hero.rawValue).toBe(1);
	});

	it("defines names for all known types", () => {
		expect(CharacterType.Hero.name).toBe("Hero");
		expect(CharacterType.Enemy.name).toBe("Enemy");
		expect(CharacterType.Weapon.name).toBe("Weapon");

		spyOn(console, "assert");
		new CharacterType().name;
		expect(console.assert).toHaveBeenCalled();
	});

	it("has a custom string representation", () => {
		expect(CharacterType.Hero.toString()).toBe("CharacterType{Hero}");
	});
});
