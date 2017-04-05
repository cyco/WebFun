import dispatch from '/util/dispatch';

describe('dispatch', () => {
	it('dispatch is an alias for setTimeout', (done) => {
		dispatch(() => {
			expect(true).toBe(true);
			done();
		});
	});

	it('can take an optional delay', (done) => {
		dispatch(() => {
			expect(true).toBe(true);
			done();
		}, 10);
	});
});
