const load = function(key) {
	try {
		if (this.has(key)) return JSON.parse(this.getItem(key));
	} catch (e) {
		console.warn("Invalid item in Storage: ", this.getItem(key));
	}
	return null;
};

if (typeof Storage !== "undefined") {
	Storage.prototype.load = Storage.prototype.load || load;
}

export default load;