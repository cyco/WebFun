export default (stream, length, result) => {
	let r;
	if (length instanceof Function)
		r = length(stream, result);
	else if (typeof length === "string")
		r = result[length];
	else
		r = length;
	return r;
};