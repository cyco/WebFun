const dispatch = (fn: Function, t: number = 0): Promise<void> => new Promise((res, rej) => {
	window.setTimeout(async () => {
		try {
			await fn();
			res();
		} catch (e) {
			rej(e);
		}
	}, t);
});
export default dispatch;
