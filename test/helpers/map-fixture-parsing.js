import { getFixtureContent } from "./fixture-loading";

export default name => {
	return getFixtureContent(name)
		.split("\n")
		.filter(function(line) {
			return line.length && line[0] !== ";";
		})
		.map(function(line) {
			let parts = line
				.split(",")
				.map(function(v) {
					return parseInt(v, 0x10);
				})
				.map(function(v) {
					return v === 0xffff ? -1 : v;
				});
			let data = parts.slice(3);
			return {
				seed: parts[0],
				planet: parts[1],
				size: parts[2],
				data: data.slice(0, 1000)
			};
		});
};
