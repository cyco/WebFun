import toHex from "src/extension/number/to-hex";

describe("WebFun.Extension.Number.toHex", () => {
	it("is an extension of the number prototype", () => {
		expect(typeof Number.prototype.toHex).toBe("function");
		expect(typeof toHex).toBe("function");
	});

	it("formats the number as 0x-prefixed hex string", () => {
		expect((0).toHex()).toBe("0x0");
		expect((10).toHex()).toBe("0xa");
		expect((0xff).toHex()).toBe("0xff");
	});

	it("takes an optional argument specifying how many digits a number should use", () => {
		expect((0).toHex(3)).toBe("0x000");
		expect((10).toHex(2)).toBe("0x0a");
		expect((0xff).toHex(1)).toBe("0xff");
	});
});
