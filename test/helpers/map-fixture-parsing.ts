import { getFixtureContent } from "./fixture-loading";

export default (name: string) => {
	return getFixtureContent(name)
		.split("\n")
		.filter((line: string) => line.length && line[0] !== ";")
		.map((line: string) => {
			const parts = line
				.split(",")
				.map(function (v) {
					return parseInt(v, 0x10);
				})
				.map(function (v) {
					return v === 0xffff ? -1 : v;
				});
			const data = parts.slice(3);
			return {
				seed: parts[0],
				planet: parts[1],
				size: parts[2],
				data: data.slice(0, 1000)
			};
		});
};
