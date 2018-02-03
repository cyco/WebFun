const iterate = function* (o: any) {
	var keys = Object.keys(o);
	for (var i = 0; i < keys.length; i++) {
		yield [keys[i], o[keys[i]]];
	}
}

export default iterate;
