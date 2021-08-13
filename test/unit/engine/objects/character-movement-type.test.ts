import CharacterMovementType from "src/engine/objects/character-movement-type";

describe("WebFun.Engine.Objects.CharMovementType", () => {
	it("is an enum type", () => {
		expect(CharacterMovementType).toBeClass();
	});

	it("can be created from a number", () => {
		expect(CharacterMovementType.fromNumber(0)).toBe(CharacterMovementType.None);
		expect(() => CharacterMovementType.fromNumber(-1)).toThrow();
	});

	it("defines names for all known types", () => {
		expect(CharacterMovementType.None.name).toBe("None");
		expect(CharacterMovementType.Unspecific1.name).toBe("Unspecific1");
		expect(CharacterMovementType.Unspecific2.name).toBe("Unspecific2");
		expect(CharacterMovementType.Unspecific3.name).toBe("Unspecific3");
		expect(CharacterMovementType.Sit.name).toBe("Sit");
		expect(CharacterMovementType.UnknownIndyOnly.name).toBe("Unknown (Indy)");
		expect(CharacterMovementType.Unspecific4.name).toBe("Unspecific4");
		expect(CharacterMovementType.Unspecific5.name).toBe("Unspecific5");
		expect(CharacterMovementType.Droid.name).toBe("Droid");
		expect(CharacterMovementType.Wander.name).toBe("Wander");
		expect(CharacterMovementType.Patrol.name).toBe("Patrol");
		expect(CharacterMovementType.Scaredy.name).toBe("Scaredy");
		expect(CharacterMovementType.Animation.name).toBe("Animation");

		expect(new CharacterMovementType().name).toBe("None");
	});

	it("has a custom string representation", () => {
		expect(CharacterMovementType.Sit.toString()).toBe("CharMovementType{Sit}");
	});

	it("maps to a number", () => {
		expect(CharacterMovementType.None.rawValue).toBe(0);
		expect(CharacterMovementType.Unspecific1.rawValue).toBe(1);
		expect(CharacterMovementType.Unspecific2.rawValue).toBe(2);
		expect(CharacterMovementType.Unspecific3.rawValue).toBe(3);
		expect(CharacterMovementType.Sit.rawValue).toBe(4);
		expect(CharacterMovementType.UnknownIndyOnly.rawValue).toBe(5);
		expect(CharacterMovementType.Unspecific4.rawValue).toBe(6);
		expect(CharacterMovementType.Unspecific5.rawValue).toBe(7);
		expect(CharacterMovementType.Droid.rawValue).toBe(8);
		expect(CharacterMovementType.Wander.rawValue).toBe(9);
		expect(CharacterMovementType.Patrol.rawValue).toBe(10);
		expect(CharacterMovementType.Scaredy.rawValue).toBe(11);
		expect(CharacterMovementType.Animation.rawValue).toBe(12);
	});
});
