const camelize = function () {
	if (!this.length) return "";

	return this.split("-")
		.map((s: string) => s.charAt(0).toUpperCase() + s.slice(1))
		.join("");
};

String.prototype.camelize = String.prototype.camelize || camelize;

declare global {
	interface String {
		camelize(): string;
	}
}

export default camelize;
