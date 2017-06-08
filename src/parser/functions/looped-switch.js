export default (type, options) => {
	const end = Object.keys(options).last();
	return (stream) => {
		const result = {};
		let key = null;
		do {
			key = type(stream, result);
			if (!(options[key] instanceof Function)) {
				console.warn(`Unknown category ${key}!`);
			}
			result[key] = options[key](stream);
		} while (key !== end);

		return result;
	};
};
