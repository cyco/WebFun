const From = (thing) => {
	return Array.prototype.slice.call(thing);
};
Array.from = Array.from || From;

export default From;
