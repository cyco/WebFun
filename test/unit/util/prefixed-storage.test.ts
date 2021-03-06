import PrefixedStorage from "src/util/prefixed-storage";

describe("WebFun.Util.PrefixedStorage", () => {
	let subject: Storage;
	let backing: Storage;
	beforeEach(() => {
		backing = {
			getItem(_: string) {},
			setItem(_: string, _v: any) {},
			removeItem(_i: string) {}
		} as any;

		subject = new PrefixedStorage(backing, "my-prefix");
	});

	it("is a wrapper around storage that prefixes every key", () => {
		expect(PrefixedStorage).toBeAClass();
	});

	describe("method setItem", () => {
		it("adds the prefix to the key before calling the backing object's implementation", () => {
			spyOn(backing, "setItem");

			subject.setItem("key", "my-data");

			expect(backing.setItem).toHaveBeenCalledWith("my-prefix.key", "my-data");
		});
	});

	describe("method removeItem", () => {
		it("adds the prefix to the key before calling removeItem on the backing store", () => {
			spyOn(backing, "removeItem");

			subject.removeItem("key");

			expect(backing.removeItem).toHaveBeenCalledWith("my-prefix.key");
		});
	});

	describe("method getItem", () => {
		it("adds the prefix to the key before calling removeItem on the backing store", () => {
			spyOn(backing, "getItem").and.returnValue("mocked-value");

			expect(subject.getItem("key")).toBe("mocked-value");
			expect(backing.getItem).toHaveBeenCalledWith("my-prefix.key");
		});
	});

	describe("method clear", () => {
		it("clear is not implemented yet", () => {
			expect(() => subject.clear()).not.toThrow();
		});

		it("key is not implemented yet", () => {
			expect(() => subject.key(0)).not.toThrow();
		});
	});

	describe("prefix chaining", () => {
		it("can be used to create namespaces in a storage", () => {
			spyOn(backing, "getItem");

			const storage = subject.prefixedWith("test").prefixedWith("name");
			storage.getItem("my-key");

			expect(backing.getItem).toHaveBeenCalledWith("my-prefix.test.name.my-key");
		});
	});
});
