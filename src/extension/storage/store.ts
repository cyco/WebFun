const store = function (key: string, object: JSONValue): JSONValue {
	try {
		if (
			typeof object === "object" &&
			object !== null &&
			object.toString !== Array.prototype.toString &&
			object.toString !== Object.prototype.toString
		) {
			this.setItem(key, JSON.stringify(object.toString()));
		} else {
			this.setItem(key, JSON.stringify(object));
		}
	} catch (e) {
		console.warn("Unable to store item: ", e);
	}

	return object;
};

Storage.prototype.store = Storage.prototype.store || store;

export default store;
