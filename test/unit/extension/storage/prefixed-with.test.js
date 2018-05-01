import prefixedWith from "src/extension/storage/prefixed-with";
import * as util from "src/util";

describe("WebFun.Extension.Storage.prefixedWith", () => {
	it("it extends the Storage prototype", () => {
		expect(Storage.prototype.prefixedWith).toBeFunction();
	});

	it("is used to create a prefixed storage from a given storage", () => {
		const mockedPrefixStorage = {};
		spyOn(util, "PrefixedStorage").and.returnValue(mockedPrefixStorage);

		const storageMock = {};
		const result = prefixedWith.call(storageMock, "test-prefix");

		expect(result).toBe(mockedPrefixStorage);
		expect(util.PrefixedStorage).toHaveBeenCalledWith(storageMock, "test-prefix");
	});
});
