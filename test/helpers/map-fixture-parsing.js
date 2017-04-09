import { getFixtureContent } from './fixture-loading';

export default (name) => {
	return getFixtureContent(name).split('\n')
		.filter(function(line) {
			return line.length && line[0] !== ';';
		}).map(function(line) {
			let parts = line.split(', ').map(function(v) {
				return parseInt(v, 0x10);
			}).map(function(v) {
				return v === 0xFFFF ? -1 : v;
			});
			let data = parts.slice(3);
			if (data.length !== 100 && data.length !== 1000) console.log('ERRORRRROR');
			return {
				seed: parts[0],
				planet: parts[1],
				size: parts[2],
				data: data
			};
		});
};
