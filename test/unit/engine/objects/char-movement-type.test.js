import CharMovementType from "src/engine/objects/char-movement-type";

describe("WebFun.Engine.Objects.CharMovementType", () => {
	it("is an enum type", () => {
		expect(CharMovementType).toBeClass();
	});

	it("can be created from a number", () => {
		expect(CharMovementType.fromNumber(0)).toBe(CharMovementType.None);
		expect(() => CharMovementType.fromNumber(-1)).toThrow();
	});

	it("defines names for all known types", () => {
		expect(CharMovementType.None.name).toBe("None");
		expect(CharMovementType.Unspecific1.name).toBe("Unspecific1");
		expect(CharMovementType.Unspecific2.name).toBe("Unspecific2");
		expect(CharMovementType.Unspecific3.name).toBe("Unspecific3");
		expect(CharMovementType.Sit.name).toBe("Sit");
		expect(CharMovementType.UnknownIndyOnly.name).toBe("Unknown (Indy)");
		expect(CharMovementType.Unspecific4.name).toBe("Unspecific4");
		expect(CharMovementType.Unspecific5.name).toBe("Unspecific5");
		expect(CharMovementType.Unspecific6.name).toBe("Unspecific6");
		expect(CharMovementType.Wander.name).toBe("Wander");
		expect(CharMovementType.Patrol.name).toBe("Patrol");
		expect(CharMovementType.Unspecific7.name).toBe("Unspecific7");
		expect(CharMovementType.Animation.name).toBe("Animation");

		expect(new CharMovementType().name).toBe("None");
	});

	it("has a custom string representation", () => {
		expect(CharMovementType.Sit.toString()).toBe("CharMovementType{Sit}");
	});

	it("maps to a number", () => {
		expect(CharMovementType.None.rawValue).toBe(0);
		expect(CharMovementType.Unspecific1.rawValue).toBe(1);
		expect(CharMovementType.Unspecific2.rawValue).toBe(2);
		expect(CharMovementType.Unspecific3.rawValue).toBe(3);
		expect(CharMovementType.Sit.rawValue).toBe(4);
		expect(CharMovementType.UnknownIndyOnly.rawValue).toBe(5);
		expect(CharMovementType.Unspecific4.rawValue).toBe(6);
		expect(CharMovementType.Unspecific5.rawValue).toBe(7);
		expect(CharMovementType.Unspecific6.rawValue).toBe(8);
		expect(CharMovementType.Wander.rawValue).toBe(9);
		expect(CharMovementType.Patrol.rawValue).toBe(10);
		expect(CharMovementType.Unspecific7.rawValue).toBe(11);
		expect(CharMovementType.Animation.rawValue).toBe(12);
	});
});
