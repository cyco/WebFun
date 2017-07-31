import dispatch from "/util/dispatch";

describe('dispatch', () => {
	it('dispatch is an alias for setTimeout', (done) => {
		dispatch(() => {
			expect(true).toBeTrue();
			done();
		});
	});

	it('can take an optional delay', (done) => {
		dispatch(() => {
			expect(true).toBeTrue();
			done();
		}, 0);
	});
});
