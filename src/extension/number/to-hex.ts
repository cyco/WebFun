const toHex = function (length: number = 0): string {
	return `0x${this.toString(0x10).padStart(length, "0")}`;
};

Number.prototype.toHex = Number.prototype.toHex || toHex;

declare global {
	interface Number {
		toHex(length?: number): string;
	}
}

export default toHex;
