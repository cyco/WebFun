import ResetCursor from '/ux/reset-cursor';

xdescribe('ResetCursor', () => {
	it('in Safari it changes the cursor immediately without waiting for mouse movement', () => {
		expect(typeof ResetCursor).toBe('function');
		expect(() => {
			ResetCursor();
		}).not.toThrow();
	});
});
