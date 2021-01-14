import MutableChar from "src/engine/mutable-objects/mutable-char";
import { Char } from "src/engine/objects";

describe("WebFun.Engine.MutableObjects.MutableChar", () => {
	let subject: MutableChar;

	it("can be created as a copy of an existing Char", () => {
		const template: Char = {
			id: 5,
			name: "mocked char",
			garbage1: 1,
			garbage2: 2
		} as any;

		subject = new MutableChar(template);
		expect(subject.id).toBe(5);
		expect(subject.name).toBe("mocked char");
		expect(subject.garbage1).toBe(1);
		expect(subject.garbage2).toBe(2);
	});
});
