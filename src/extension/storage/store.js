export const store = function(key, object) {
	try {
		this.setItem(key, JSON.stringify(object));
	} catch (e) {
		console.warn("Unable to store item Storage: ", e);
	}
};

if (typeof Storage !== "undefined" && Storage.prototype) {
	Storage.prototype.store = Storage.prototype.store || store;
}
