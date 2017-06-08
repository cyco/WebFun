export default (definition) => {
	return (stream) => {
		const result = {};
		definition.each((key, reader) => {
			result[key] = reader(stream, result);
		});
		return result;
	};
};