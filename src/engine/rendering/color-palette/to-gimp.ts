function toGIMP(buffer: Uint32Array, name: string): string {
	let out = "";

	out += `GIMP Palette` + "\n";
	out += `Name: ${name}` + "\n";
	out += `#` + "\n";

	for (let i = 0; i < this.length; i++) {
		const value = buffer[i];

		out +=
			`${(value >> 16) & 0xff} ${(value >> 8) & 0xff} ${value & 0xff}${i === 0 ? " transparent" : ""}` +
			"\n";
	}

	return out;
}

export default toGIMP;
