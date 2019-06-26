import Description, { Description as NamedDescription } from "src/description";

describe("WebFun.Description", () => {
	it("it holds the values displayed in the about section", () => {
		expect(Description.Year).toBe(2017);
		expect(NamedDescription).toEqual(Description);
	});
});
