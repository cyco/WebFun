const store = function (key: string, object: JSONValue) {
	try {
		this.setItem(key, JSON.stringify(object));
	} catch (e) {
		console.warn("Unable to store item Storage: ", e);
	}
};

if (typeof Storage !== "undefined") {
	Storage.prototype.store = Storage.prototype.store || store;
}

export default store;
