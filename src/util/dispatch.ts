const dispatch = <T>(fn: () => Promise<T> | T, t: number = 0): Promise<T> =>
	new Promise((res, rej) => {
		window.setTimeout(async () => {
			try {
				res(await fn());
			} catch (e) {
				rej(e);
			}
		}, t);
	});
export default dispatch;
