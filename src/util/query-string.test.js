import QueryString from "/util/query-string";

describe('QueryString', () => {
	it('has a method to create a query string from an object', () => {
		expect(typeof QueryString.Compose).toBe('function');

		let result = QueryString.Compose({x: "test", y: 10});
		expect(result).toBe('x=test&y=10');
	});
});
