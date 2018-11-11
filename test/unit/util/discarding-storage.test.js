import DiscardingStorage from "src/util/discarding-storage";

describe("WebFun.Util.DiscardingStorage", () => {
	let subject = null;
	beforeEach(() => (subject = new DiscardingStorage()));

	it("is a class that adheres to the Storage interface but throws away all values", () => {
		expect(DiscardingStorage).toBeClass();
	});

	it("defines all the necessary functions", () => {
		expect(() => subject.setItem("test", "value")).not.toThrow();
		expect(subject.getItem("test")).toBeNull();
		expect(() => subject.removeItem("test")).not.toThrow();
		expect(() => subject.clear()).not.toThrow();
		expect(subject.length).toBe(0);
		expect(subject.key(0)).toBeNull();
	});

	it("supports the storage extensions", () => {
		expect(() => subject.store("test", "value")).not.toThrow();
		expect(subject.load("test")).toBeNull();
		expect(subject.has("test")).toBeFalse();
		expect(subject.prefixedWith("test")).toBe(subject);
	});
});
