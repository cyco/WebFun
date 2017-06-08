export default (index, end, type) => {
	return (stream) => {
		const result = [];
		let idx;
		while ((idx = index(stream, result)) !== end) {
			result[idx] = type(stream, result);
		}
		return result;
	};
};
