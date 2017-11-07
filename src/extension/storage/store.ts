const store = function (key: string, object: JSONValue) {
	try {
		if (typeof object === "object" && object.toString !== Object.prototype.toString) {
			this.setItem(key, JSON.stringify(object.toString()));
		} else {
			this.setItem(key, JSON.stringify(object));
		}
	} catch (e) {
		console.warn("Unable to store item Storage: ", e);
	}
};

if (typeof Storage !== "undefined") {
	Storage.prototype.store = Storage.prototype.store || store;
}

export default store;
