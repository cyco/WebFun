export default function <T>(cb: Function): T[] {
	const result: T[] = [];
	const length = this.length;
	for (let i = 0; i < length; i++) {
		result.push(cb(this[i], i, this));
	}
	return result;
}
