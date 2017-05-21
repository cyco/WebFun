const has = function(key) {
	return this.getItem(key) !== null;
};

if (typeof Storage !== "undefined") {
	Storage.prototype.has = Storage.prototype.has || has;
}

export default has;
