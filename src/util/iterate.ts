const iterate = function* (o: any) {
	const keys = Object.keys(o);
	for (let i = 0; i < keys.length; i++) {
		yield [keys[i], o[keys[i]]];
	}
};

export default iterate;
