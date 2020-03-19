export default function(cb: any): any[] {
	const result = [];
	const length = this.length;
	for (let i = 0; i < length; i++) {
		result.push(cb(this[i], i, this));
	}
	return result;
}
